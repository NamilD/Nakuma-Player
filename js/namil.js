var currentSongNumber=0;
var playing = false;            
var gainNode ;
var files;
var url;
var audio;
var audioVolumeRatio=0;
var songListArray;
var repeatbutton=false;
var shufflebutton=false;
var resetAudiosource=true;

function init(){
    loadPlayer();
    addMediaEvents();  
}
            
function loadPlayer(){
    audio = new Audio();
    audio.controls = false;
    audio.autoplay = true;
    document.body.appendChild(audio);
    
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
    console.log("file: "+f.name);
    if(window.createObjectURL){
        url = window.createObjectURL(f)
    }else if(window.createBlobURL){
        url = window.createBlobURL(f)
    }else if(window.URL && window.URL.createObjectURL){
        url = window.URL.createObjectURL(f)
    }else if(window.webkitURL && window.webkitURL.createObjectURL){
        url = window.webkitURL.createObjectURL(f)
    }
    
    audio.src = url;
    audio.load();
    resetAudiosource=false;
    console.log(url);
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
    resetAudiosource=true;
}
function addMediaEvents(){
    audio.addEventListener('ended', endedMedia);
}
function endedMedia(){
    
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
    this.files=file;
    songListArray=createArray(files.length);
}

function setTableRow(SongNumber){
//console.log(SongNumber);
//$('tr:nth-child('+(SongNumber+1)+') td').addClass("highlight");
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