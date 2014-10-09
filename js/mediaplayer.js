var fileSize=0;
$curr_secs=0;
var button_activated=false;

$( document ).ready(function() {
    // initialize bootstrap switch elements
    $("[name='my-checkbox']").bootstrapSwitch();
  
    /**
     * mediaplayer buttons
     */
    $btPlay=$("#btn-play");     //use  $btPlay=$(".btn-play"); when using classes 
    $btPause=$("#btn-pause");
    $btPrevious=$("#btn-step-backward");
    $btNext=$("#btn-step-forward");
    $btStop=$("#btn-stop");
    $btvolume_min=$("#btn-volume-off");
    $btvolume_normal=$("#btn-volume-down");
    $btvolume_max=$("#btn-volume-up");
    $btvolume_bar=$("#btn-volume-bar");
    $btopen=$("#btn-open");
    $input_file=$("#input-file");
    createPlayer();
    init();
    addMediaElementEvents();            
    initializeInputFile();
    
    $("[name='my-checkbox']").bootstrapSwitch('disabled', true);
    
    $input_file.on( 'change', function( event ){
        var elems =this.files;
        if(elems.length>0){
            setFile(this.files); // FileList object
            fileSize=elems.length;
            if(!button_activated){
                addButtonEvents();
                button_activated=true;
            }
            updateButtons('play');
            resetPlay();
        }
    } );
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
});

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var elems = evt.dataTransfer.files;
    if(elems.length>0){
        setFile(elems); // FileList object
        fileSize=elems.length;
        if(!button_activated){
            addButtonEvents();
            button_activated=true;
        }
        updateButtons('play');
        resetPlay();
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function createPlayer(){
    $btPause.hide();
    $btvolume_min.hide();
    $btvolume_normal.hide();
}

function initializeInputFile(){    
    $btopen.on( 'click', function( event ) {
        $( "#input-file" ).click();
    } );
}
function addButtonEvents(){
    $btPlay.on( "click", function(event){
        if(fileSize==0){
            alert("No files");
        }
        else{
            updateButtons('play');
            play();
        }
    });
    $btPause.on( "click", function(event){
        updateButtons('pause');
        pause();
    });
    $btStop.on( "click", function(event){
        updateButtons('stop');
        stop();
    });
    $btPrevious.on( "click", function(event){
        updateButtons('previous');
        previous();
    });
    $btNext.on( "click", function(event){
        updateButtons('next');
        next();
    });
    $btvolume_min.on( "click", function(event){
        $vol=document.getElementById('btn-volume-bar').value;
        console.log("Volume : "+$vol);
        updateVolume($vol); 
    });
    $btvolume_normal.on( "click", function(event){
        updateVolume(0);
    });
    $btvolume_max.on( "click", function(event){
        updateVolume(0);
    });
    $btvolume_bar.on( 'change', function( event ){
        $vol=document.getElementById('btn-volume-bar').value;
        updateVolume($vol); 
        
    } );
    
    $('#btn-repeat').on('switchChange', function (e, data) {
        setRepeatButton(data.value);
    });
    $('#btn-shuffle').on('switchChange', function (e, data) {
        setShuffleButton(data.value);
    });
    
    $("[name='my-checkbox']").bootstrapSwitch('disabled', false);
    
	// Toggle full screen key listener
	// reference: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 13) {
			toggleFullScreen();
		}
	}, false);
	
	/*$btPrevious.on("keypress",function(e){
	   if(e.keyCode === 13){
		   e.preventDefault();
	   }
	}, false);*/
}

function updateButtons(button){
    switch( button ) {  
        case 'play'		:
            $btPlay.hide();
            $btPause.show();
            break;
        case 'pause'		:
            $btPlay.show();
            $btPause.hide();
            break;
        case 'stop'		:
            $btPlay.show();
            $btPause.hide();
            break;
        case 'previous'	:
            $btPlay.hide();
            $btPause.show();
            break;
        case 'next'	:
            $btPlay.hide();
            $btPause.show();
            break;
        case 'vol_mute'	:
            $btvolume_min.show();
            $btvolume_normal.hide();
            $btvolume_max.hide();
            break;
        case 'vol_max'	:
            $btvolume_min.hide();
            $btvolume_normal.hide();
            $btvolume_max.show();
            break;
        case 'vol_normal'	:
            $btvolume_min.hide();
            $btvolume_normal.show();
            $btvolume_max.hide();
            break;
    }
}
function updateVolume($vol){
    if($vol==0){
        updateButtons('vol_mute');
    }else if($vol<0.5){
        updateButtons('vol_normal');
    }else{
        updateButtons('vol_max');
    }
    setVolume($vol);
}

function addMediaElementEvents(){
    audio.addEventListener( 'timeupdate', function( event ) {
        
        document.getElementById('seekbar').value= audio.currentTime;  
        $tempTime=Math.round(audio.currentTime);
        if($curr_secs!=$tempTime){
            $curr_secs=$tempTime;
            
            $curr_mins=Math.round($curr_secs/60);
            $curr_hrs=Math.round($curr_mins/60);
            $curr_secs=$curr_secs%60;
            
            if ($curr_hrs   < 10) {
                $curr_hrs   = "0"+$curr_hrs;
            }
            if ($curr_mins < 10) {
                $curr_mins = "0"+$curr_mins;
            }
            if ($curr_secs < 10) {
                $curr_secs = "0"+$curr_secs;
            }
            
            $('#media-duration').text(""+$curr_hrs+":"+$curr_mins+":"+$curr_secs);
            
            setMediaTitle(Math.round(audio.currentTime));
        }
    });
	
	video.addEventListener( 'timeupdate', function( event ) {
        
        document.getElementById('seekbar').value= video.currentTime;  
        $tempTime=Math.round(video.currentTime);
        if($curr_secs!=$tempTime){
            $curr_secs=$tempTime;
            
            $curr_mins=Math.round($curr_secs/60);
            $curr_hrs=Math.round($curr_mins/60);
            $curr_secs=$curr_secs%60;
            
            if ($curr_hrs   < 10) {
                $curr_hrs   = "0"+$curr_hrs;
            }
            if ($curr_mins < 10) {
                $curr_mins = "0"+$curr_mins;
            }
            if ($curr_secs < 10) {
                $curr_secs = "0"+$curr_secs;
            }
            
            $('#media-duration').text(""+$curr_hrs+":"+$curr_mins+":"+$curr_secs);
            
            setMediaTitle(Math.round(video.currentTime));
        }
    });
    
    audio.addEventListener( 'loadedmetadata', function( event ) {
        document.getElementById('seekbar').max= audio.duration;
    });
	video.addEventListener( 'loadedmetadata', function( event ) {
        document.getElementById('seekbar').max= video.duration;
    });
}

function mediaTimeSet(){
    setMediaCurrentTime(document.getElementById('seekbar').value);
}


// Toggle fulscreen code
function toggleFullScreen() {
	
	//reference: http://css-tricks.com/custom-controls-in-html5-video-full-screen/
	
	if (isFullScreen()) {
		exitFullScreen();
    }
	else {
		goFullScreen();
    }
}

function changeFullScreen(){
	if(isFullScreen()){
		exitFullScreen();
		console.log("Exit fullScreen");
		goFullScreen();
		console.log("Go fullScreen");
	}
}

function goFullScreen(){

	var videoContainer = document.getElementById('media-video');
	var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
	if (!fullScreenEnabled) {
		fullscreen.style.display = 'none';
	}
	if(playingMediaType == FileTypesEnum.Video){
			// Fullscreen video and Player controls
			console.log("Playing Media Type: Video + RequestFullScreen");
			if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
			else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
			else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
			else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
			setFullscreenData(true);
	}
	else if(playingMediaType == FileTypesEnum.Audio){
			//Fullscreen whole player
			console.log("Playing Media Type: Audio + RequestFullScreen");
			if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
			else if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen();
			else if (document.documentElement.webkitRequestFullScreen) document.documentElement.webkitRequestFullScreen();
			else if (document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
			setFullscreenData(true);
	}
}

function exitFullScreen(){
	if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    setFullscreenData(false);
	console.log("Exit fullScreen");
}

var isFullScreen = function() {
   return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

var setFullscreenData = function(state) {
	var videoContainer = document.getElementById('media-video');
	videoContainer.setAttribute('data-fullscreen', !!state);
}