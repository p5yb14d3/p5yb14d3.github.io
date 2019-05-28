var soundon = true;

var snd1  = new Audio();
var src1  = document.createElement("source");
src1.id = "src1";
src1.type = "audio/mpeg";
src1.src  = "audio/space1.wav";
snd1.appendChild(src1);
snd1.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
snd1.play(); 

var snd2  = new Audio();
var src2  = document.createElement("source");
src2.id = "src2";
src2.type = "audio/mpeg";
src2.src  = "audio/space2.wav";
snd2.appendChild(src2);
snd2.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
snd2.play(); 

function audioPlay(filename) {
	var snd  = new Audio();
	var src3  = document.createElement("source");
	src3.id = "src3";
	src3.type = "audio/mpeg";
	src3.src  = "audio/"+filename+".wav";
	snd.appendChild(src3);
	snd.addEventListener('ended', function() {

	}, false);
	snd.play(); 
}

function audioPlayArray(filenames, index=0) {
	if (index > filenames.length + 1) {
		alert("finished");
		return true;
	}
	var snd  = new Audio();
	var src3  = document.createElement("source");
	src3.type = "audio/mpeg";
	src3.src  = "audio/"+filenames[index]+".wav";
	snd.appendChild(src3);
	snd.addEventListener('ended', function() {
		index++;
		audioPlayArray(filenames, index);
	}, false);
	snd.play(); 
}

