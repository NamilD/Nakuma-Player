$curr_secs=0;

var fileSize=0;

var JSONObject = {
    Tags: []
};
function mediaTimeSet(){
    setMediaCurrentTime(document.getElementById('seekbar').value);
}
jQuery(document).ready(function(){
    /**
     * mediaplayer buttons
     */
    $btPlay=$("#btn-play");     //use  $btPlay=$(".btn-play"); when using classes 
    $btPause=$("#btn-pause");
    $btPrev=$("#btn-prev");
    $btNext=$("#btn-next");
    $btStop=$("#btn-stop");
    $btvol_min=$(".icon-vol-min");
    $btvol_normal=$(".icon-vol-normal");
    $btvol_max=$(".icon-vol-max");
    $btvolume_bar=$("#volumebar");
    $btOther_open=$("#other_Button-open");
    
    
    document.querySelector('#file-input').onchange = function(e) {
        /*
	Pass the File instance to ID3.js
        You could iterate over this.files to handle many at once
         */
        var elems =this.files;
        if(elems.length>0){
            setFile(this.files); // FileList object
            fileSize=elems.length;
            JSONObject.Tags=[];
            for (i = 0; i < elems.length; i += 1) {
                var song_url = elems[i].name;
                
                var song_artist;
                var song_title;
                var song_album;
                var song_year;
                id3(elems[i],function(err,tags) {   
                    song_artist=tags.artist;
                    song_title=tags.title;
                    song_album=tags.album;
                    song_year=tags.year;
                    
                    var tmp = {
                        "artist": song_artist,
                        "title": song_title,
                        "album": song_album,
                        "year": song_year
                    };
                    JSONObject.Tags.push(tmp);
                    signal_finished_part();
                });
            }
            updateButtons('play');
            fileInput_Close();
            resetPlay();
            
        }
        fileInput_Close(); 
    
    }
    createPlayer();
    addButtonEvents();
    init();
    addMediaElementEvents();
    showInputWindow();
});

function createPlayer(){
    $btPause.hide();
    $btvol_min.hide();
    $btvol_normal.hide();


}
function addButtonEvents(){
    $btPlay.on( 'click', function( event ) {
        updateButtons('play');
        play();
    
    } );
    $btPause.on( 'click', function( event ){
        updateButtons('pause');
        pause();
    } );
    $btPrev.on( 'click', function( event ) {
        updateButtons('prev');
        previous();
    
    } );
    $btNext.on( 'click', function( event ){
        updateButtons('next');
        next();
    } );
    $btStop.on( 'click', function( event ){
        updateButtons('stop');
        stop();
    } );
    $btvol_min.on( 'click', function( event ){
        $vol=document.getElementById('volumebar').value;
        updateVolume($vol);
    } );
    $btvol_normal.on( 'click', function( event ){
        updateVolume(0);
    } );
    $btvol_max.on( 'click', function( event ){
        updateVolume(0);
    } );
    $btvolume_bar.on( 'change', function( event ){
        $vol=document.getElementById('volumebar').value;
        updateVolume($vol); 
    } );
    $btOther_open.on( 'click',function (event){
        showInputWindow();
    });
}
function showInputWindow(){
    var loginBox = $btOther_open.attr('href');
    
    //Fade in the Popup and add close button
    $(loginBox).fadeIn(300);
    
    //Set the center alignment padding + border
    var popMargTop = ($(loginBox).height() + 24) / 2; 
    var popMargLeft = ($(loginBox).width() + 24) / 2; 
    
    $(loginBox).css({ 
        'margin-top' : -popMargTop,
        'margin-left' : -popMargLeft
    });
    
    // Add the mask to body
    $('body').append('<div id="mask"></div>');
    $('#mask').fadeIn(300);
    
    return false;
}

function updateButtons( button ){
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
        case 'prev'	:
            $btPlay.hide();
            $btPause.show();
            break;
        case 'next'	:
            $btPlay.hide();
            $btPause.show();
            break;
        case 'vol_mute'	:
            $btvol_min.show();
            $btvol_normal.hide();
            $btvol_max.hide();
            break;
        case 'vol_max'	:
            $btvol_min.hide();
            $btvol_normal.hide();
            $btvol_max.show();
            break;
        case 'vol_normal'	:
            $btvol_min.hide();
            $btvol_normal.show();
            $btvol_max.hide();
            break;
    }
}
function addMediaElementEvents(){
    audio.addEventListener( 'timeupdate', function( event ) {
        
        document.getElementById('seekbar').value= audio.currentTime;    //set seek bar length
        
        $mediaTime=document.getElementById('media-duration');
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
            
            $mediaTime.innerHTML=""+$curr_hrs+":"+$curr_mins+":"+$curr_secs;
            
            setMediaTitle(Math.round(audio.currentTime));
        }
    });
    
    audio.addEventListener( 'loadedmetadata', function( event ) {
        document.getElementById('seekbar').max= audio.duration;
    });
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

function fileInput_Close(){
    $('#login-box,#mask').fadeOut(300 , function() {
        $('#mask').remove(); 
    }); 

}

function loadLibrary(){
    var Titles=new Array("Song name","Year","Title","Album");
    var table = $('<table></table>').addClass('foo');
    
    var thead = $('<thead></thead>');
    
    var row = $('<tr></tr>').addClass('bar');
    for(i=0;i<Titles.length;i++){
        var rowitem=$('<th scope="col"></th>').addClass('bar').text(Titles[i]);
        row.append(rowitem);
    }
    thead.append(row);
    
    var tbody = $('<tbody></tbody>');
    for(i=0; i<JSONObject.Tags.length; i++){
        var row = $('<tr></tr>').addClass('bar');
        
        var rowitem_name=$('<td></td>').addClass('bar').text(JSONObject.Tags[i].name);
        row.append(rowitem_name);
        var rowitem_genere=$('<td></td>').addClass('bar').text(JSONObject.Tags[i].year);
        row.append(rowitem_genere);
        var rowitem_name=$('<td id="title"></td>').addClass('bar').text(JSONObject.Tags[i].title);
        row.append(rowitem_name);
        var rowitem_album=$('<td></td>').addClass('bar').text(JSONObject.Tags[i].album);
        row.append(rowitem_album);
        var rowitem_hidden=$('<input type="hidden" id="song_no" value="'+i+'"/>');
        row.append(rowitem_hidden);
        
        row.dblclick(function() {
            var songNo = $(this).find("#song_no").val(); 
            
            changeSong(songNo);
            updateButtons('play');
        });
        tbody.append(row);
    }
    
    table.append(thead);
    table.append(tbody);
    
    $('#column1').empty();
    $('#column1').append(table);
    //$('tr:nth-child(1) td').addClass("highlight"); //highlight current song
}

var parts_done = 0;
function signal_finished_part(){
    parts_done ++;
    if(parts_done >= fileSize){
        signal_all_parts_done();
    }
}

function signal_all_parts_done(){
    
    for (i = 0; i < files.length; i += 1) {
        JSONObject.Tags[i]["name"]=files[i].name;
    }
    loadLibrary();
}

