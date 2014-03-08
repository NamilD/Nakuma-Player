var currentSongNumber=0;
var playing = false;            
var gainNode ;
var files;
var url;
var audio;
var audioVolumeRatio=0;

function init(){
    loadPlayer();
    addMediaEvents();  
}
            
function loadPlayer(){
    audio = new Audio();
    audio.controls = false;
    audio.autoplay = true;
    document.body.appendChild(audio);
    
    var context = new webkitAudioContext();
    var source = context.createMediaElementSource(audio);
    gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.connect(context.destination);
}
function loadAudioFile(number){
    var f=files[number];
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
}
function play(){
    if(audio.src==""){       //there is no audio file loaded in to the audio element
        loadAudioFile(currentSongNumber);
    }
    playing=true;
    audio.play();
    setMediaTitle(0);
    setTableRow(currentSongNumber);
}
function resetPlay(){
    resetAudioSource();
    setRandomSongNumber(0); //set current song song to 0
    play();
}
function changeSong(number){
    if(currentSongNumber!=number){
        resetAudioSource();
        setRandomSongNumber(number);
        play();
    }
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
        console.log("current"+currentSongNumber);
        currentSongNumber= (currentSongNumber+1)%files.length;
    }
}
function setPreviousSongNumber(){
    if(files.length>1){
        currentSongNumber= (currentSongNumber-1+files.length)%files.length;
    }
}
function setRandomSongNumber(number){
    currentSongNumber=number%files.length;
    
}
function resetAudioSource(){
    audio.src=null;
}
function addMediaEvents(){
    audio.addEventListener('ended', endedMedia);
}
function endedMedia(){
    if(playing){
        next(); 
    }
}
function setMediaCurrentTime(audiolength){
    audio.currentTime =audiolength;
}
function setMediaTitle($timer){
    $mediaTitle=document.getElementById('media-title');
    var defaultitle_length=25;
    if($mediaTitle!=null){
        
        var songTitle;
        if(JSONObject!=null){
            songTitle=JSONObject.Tags[currentSongNumber].title;
        }else{                
            songTitle=files[currentSongNumber].name;
        }
        var songLength=songTitle.length;
        
        if(songLength<=defaultitle_length){     //default output string size is 20
            if(JSONObject!=null){
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
                    
                    outputText=outputText+'<span>&nbsp;</span>';
                                        
                }
                else{
                    var x=j%(defaultitle_length*2);
                
                    outputText=outputText+'<span>'+songTitle.charAt(x)+'</span>';
                }
            }
            //$mediaTitle.innerHTML=outputText;
            $("#media-title").html(outputText);
        }
        
        
    }
    else{
        alert("no Title Element inside your player!");
    }
}
function setFile(file){
    this.files=file;
}

function setTableRow(SongNumber){
    console.log(SongNumber);
//$('tr:nth-child('+(SongNumber+1)+') td').addClass("highlight");
}