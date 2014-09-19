var currentSongNumber=0;
var playing = false;            
var gainNode ;
var files=[];
var url;
var audio;
var audioVolumeRatio=0;
var songListArray;
var repeatbutton=false;
var shufflebutton=false;
var resetAudiosource=true;
var video;
var tempAudio;

/* Enumeration to store the file Types
 * File Types: Audio, Video, Other
 */

var FileTypesEnum = {
	
	Other: 0,
	Video: 1,
	Audio: 2
}

/* Returns the type of the file
 *  Parameters: 
 *		file: file to checked
 *
 *  Return Values: FileTypesEnum
 */		

function getFileType(file){
	var ftString = file.type.toString();
	var args = ftString.split("/");
	
	if(args[0]=="video"||args[0]=="Video"){
		return FileTypesEnum.Video;
	}
	else if(args[0]=="audio"||args[0]=="Audio"){
		return FileTypesEnum.Audio;
	}
	
	return FileTypesEnum.Other;
}

function init(){
    loadPlayer();
    addMediaEvents();  
}
            
function loadPlayer(){
    audio = new Audio();
    audio.controls = false;
    audio.autoplay = true;
    document.body.appendChild(audio);
    tempAudio=audio;
    // Get video element in to the javascript context
    video=document.getElementById('media-video');
    
    var context = null;
    usingWebAudio = true;
    if (typeof AudioContext !== 'undefined') {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
        context = new webkitAudioContext();
    } else {
        usingWebAudio = false;
    }
    
    if(!usingWebAudio){
        alert("Not supported");
    }
    
    var source = context.createMediaElementSource(audio);
    gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.connect(context.destination);
}
function loadAudioFile(number){
    console.log("loadaudiofile");
    var temp=songListArray[number];
    var f=files[temp];
    //console.log("file: "+f.name);
    if(window.createObjectURL){
        url = window.createObjectURL(f)
    }else if(window.createBlobURL){
        url = window.createBlobURL(f)
    }else if(window.URL && window.URL.createObjectURL){
        url = window.URL.createObjectURL(f)
    }else if(window.webkitURL && window.webkitURL.createObjectURL){
        url = window.webkitURL.createObjectURL(f)
    }
    var fileType=getFileType(f);
    if(fileType == FileTypesEnum.Video){
    	audio =video;
    }
    else if(fileType == FileTypesEnum.Audio){
    	audio = tempAudio;
    }
    else{
    	alert("Not a supported file type!");
    }
    	audio.src = url;
    	audio.load();
    	resetAudiosource=false;
    	console.log(url);
    /*
    */
}
function play(){
    ///if(audio.src==null){       //there is no audio file loaded in to the audio element
    if(resetAudiosource){       //there is no audio file loaded in to the audio element
        loadAudioFile(currentSongNumber);
    }
    playing=true;
    audio.play();
    setMediaTitle(0);
    setTableRow(currentSongNumber);
}
function resetPlay(){
    resetAudioSource();
    currentSongNumber=0;
    play();
}

function previous(){
    resetAudioSource();     //reset the source in to null url
    setPreviousSongNumber();
    play();
}
function next(){
    resetAudioSource();     //reset the source in to null url
    setNextSongNumber();
    play();
}
function pause(){
    audio.pause();
}
function stop(){
    pause();
    audio.currentTime=0;
    playing=false;
}
function MaxVolume(){
    gainNode.gain.value = 1;
}
function MinVolume(){
    gainNode.gain.value = 0.5;
}
function setVolume(ratio){
    audio.volume=ratio;       
}
function fastforward() {
    var audioElement = document.getElementsByTagName('audio')[0];
    audioElement.playbackRate = 3.0;
}
            
function setNextSongNumber(){
    if(files.length>1){
        currentSongNumber= (currentSongNumber+1)%files.length;
    }
}

function setPreviousSongNumber(){
    if(files.length>1){
        currentSongNumber= (currentSongNumber-1+files.length)%files.length;
    }
}

function resetAudioSource(){
    //audio.src=null;
    reSetTableRow(currentSongNumber);
    resetAudiosource=true;
}
function addMediaEvents(){
    audio.addEventListener('ended', endedMedia);
}
function endedMedia(){
    reSetTableRow(currentSongNumber);
    if(playing){
        if((!repeatbutton)&&(currentSongNumber==(files.length-1))){
            next();
            updateButtons('stop');
            stop();        
        }else{
            next();    
        }
    }
}
function setMediaCurrentTime(audiolength){
    audio.currentTime =audiolength;
}
function setMediaTitle($timer){
    $mediaTitle=document.getElementById('media-title');
    var defaultitle_length=18;
    if($mediaTitle!=null){
        
        var songTitle;
        if(false){
            songTitle=JSONObject.Tags[songListArray[currentSongNumber]].title;
        }else{                
            songTitle=files[songListArray[currentSongNumber]].name;
        }
        var songLength=songTitle.length;
        
        if(songLength<=defaultitle_length){     //default output string size is 20
            if(false){
                $mediaTitle.innerHTML=JSONObject.Tags[currentSongNumber].title;
            }else{                
                $mediaTitle.innerHTML=files[currentSongNumber].name;
            }
        }else{
            var i=$timer;
            for (var j=0;j<defaultitle_length;++j){
                songTitle=songTitle+'.';
            }
            //songTitle=songTitle+'*';
            var outputText="";
            for (var j = i; j< i+defaultitle_length+1; ++j){
                if(j==i&&songTitle.charAt(j)==" "){
                    
                    outputText=outputText+'&nbsp;';
                                        
                }
                else{
                    var x=j%(defaultitle_length*2);
                
                    outputText=outputText+""+songTitle.charAt(x);
                }
            }
            //$mediaTitle.innerHTML=outputText;
            $("#media-title").html(outputText);
        //console.log(outputText);
        }
        
        
    }
    else{
        alert("no Title Element inside your player!");
    }
}
function setFile(file){
    for(var i=0; i<file.length; i++){
        if(!include(files, file[i])){
            this.files.push(file[i]);
            
        }
        else{
            alert("contains"+file[i].name);
        }
    }
    songListArray=createArray(files.length);
    loadLibrary(files);
}

function setTableRow(SongNumber){
    var temp=songListArray[SongNumber];
    $('tr:nth-child('+(temp+1)+') td').addClass("active");
    /*temp=songListArray[SongNumber-1];
    $('tr:nth-child('+(temp+1)+') td').removeClass("active");*/
}
function reSetTableRow(SongNumber){
    var temp=songListArray[SongNumber];
    $('tr:nth-child('+(temp+1)+') td').removeClass("active");
}

function setRepeatButton(value){
    repeatbutton=value;
}
function setShuffleButton(value){
    shufflebutton=value;
    songListArray=createArray(files.length);
    console.log(songListArray);
}

function createArray(length){
    var arr=[];
    for (var i=0;i<length;++i){
        arr[i]=i;
    }
    if(shufflebutton){
        arr=shuffle(arr)
    }
    return arr;
}

function shuffle(array) {
    var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function include(arr,obj) {

    /* check the file obj is already inserted in to the file list
     * if it is return true, else false
     */
    for(var i=0; i<arr.length; i++){
        if(arr[i].name==obj.name)
            return true;
    }
    return false;
}

function loadLibrary(files){
    var Titles=new Array("Song name","Type","");
    var table = $('<table></table>').addClass("table table");
    var thead = $('<thead></thead>');
    var row = $('<tr></tr>');
    for(i=0;i<Titles.length;i++){
        var rowitem=$('<th></th>').text(Titles[i]);
        row.append(rowitem);
    }
    thead.append(row);
    var tbody = $('<tbody></tbody>').addClass('table-hover');
    for(i=0; i<files.length; i++){
        row = $('<tr></tr>');
        var rowitem_name=$('<td></td>').text(files[i].name);
        row.append(rowitem_name);
        var rowitem_type=$('<td></td>').text(files[i].type||'N/A');
        row.append(rowitem_type);
        var rowitem_button_delete=$('<td>\n\
<button type="button" class="btn btn-default btn-xs" data-toggle="tooltip" onclick="deletesong('+i+')" data-placement="right" title="Click to remove from playlist">\n\
    <span class="glyphicon glyphicon-remove" ></span>\n\
</button>\n\
<button type="button" class="btn btn-default btn-xs" data-toggle="tooltip" onclick="playSong('+i+')" data-placement="right" title="Click to play">\n\
    <span class="glyphicon glyphicon-play" ></span>\n\
</button>\n\
</td>');
        row.append(rowitem_button_delete);
        var rowitem_hidden=$('<input type="hidden" id="song_no" value="'+i+'"/>');
        row.append(rowitem_hidden);
       
        
        tbody.append(row);
    }
    
    table.append(thead);
    table.append(tbody);
    
    $('#playlist').empty();
    $('#playlist').append(table);
}

function deletesong(item){
    if(files.length<=1){
        files=[];
        $('#playlist').empty();
        var drop=$('<div class="drop-panel">Drag and drop your media files here...</div>')
        $('#playlist').append(drop);
        stop();
        return;
    }
    files.splice(item, 1);
    if(currentSongNumber==item){
        resetPlay();
    }
    songListArray=createArray(files.length);
    loadLibrary(files);
}

function playSong(item){
    var temp=songListArray.indexOf(item);
    
    if(currentSongNumber!=temp){
        resetAudioSource(); 
        currentSongNumber=temp;
        play();
    }
    
//alert("Song is"+songListArray[temp].name);
}


