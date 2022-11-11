//gallery.js
function onLoad(f) {
	if (onLoad.loaded)
		window.setTimeout(f,0);
	else if (window.addEventListener)
		window.addEventListener("load", f, false);
	else if (window.attachEvent)
		window.attachEvent("onload", f);
}

onLoad.loaded = false;
var images;
var current = 1;
onLoad(function(){
	onLoad.loaded = true;

	//load gallery.xml 
	// url: http://roku-mehari.rhcloud.com/uploads/gallery.xml
	// var gallerydata = "http://roku-mehari.rhcloud.com/uploads/gallery.xml";
	//var gallerydata = "http://services.mediamind.com/apache/VAST/DV_Allow_VAST.xml";
	var gallerydata = './gallery_dynamic.xml';

	var client = new XMLHttpRequest();
	client.onreadystatechange = handler;
	client.open("GET", gallerydata);
	client.send();

	function handler(){
		if(this.readyState == this.DONE) {
	    	if(this.status == 200 &&
	       		this.responseXML != null){ 
	      			processData(this.responseXML);
	      			return;
	    		}
	    	// something went wrong
	   		 processData(null);
	   		 console.log("error")
	  	}
	}

	function processData(xml){
		if (!xml){
			var newnode = document.createTextNode("Gallery Cannot be loaded");
			var parent = document.getElementById("gallery");
			parent.appendChild(newnode);

			return;
		}
		// parse and create thumbnail nodes
		var xthumbs = xml.getElementsByTagName("thumbnails")[0];
		var thumbs = xthumbs.getElementsByTagName("thumbnail");
		var thumbsdiv = document.getElementById("thumbs");
		var Imagesdiv = document.getElementById("bigimages");
		//create image nodes
		for (var t=0; t < thumbs.length; t++){
			processThumbs(thumbsdiv, thumbs[t], t);
		}

		// parse and create image nodes
		var ximgs = xml.getElementsByTagName("images")[0];
		var imgs = images = ximgs.getElementsByTagName("image");

		for (var i=0; i < imgs.length; i++){
			processImages(Imagesdiv, imgs[i], i);
		}

		// display and setup navigation
		var navs = Imagesdiv.getElementsByTagName("a");
		var prev = Imagesdiv.getElementsByClassName("gallery_hover gallery_hover_prev")[0];
		var next = Imagesdiv.getElementsByClassName("gallery_hover gallery_hover_next")[0];
		prev.setAttribute("nav", "prev");
		next.setAttribute("nav", "next");
		prev.addEventListener("click", goPrevious, false);
		next.addEventListener("click", goNext, false);
		prev.addEventListener("mouseover", onMouseOver, false);
		prev.addEventListener("mouseout", onMouseOut, false);
		next.addEventListener("mouseover", onMouseOver, false);
		next.addEventListener("mouseout", onMouseOut, false);
	}

	function processThumbs(parent, thumb, index){
		var img = document.createElement("img");
		img.src = thumb.getAttribute("url");
		img.alt = "";
		img.id = "thumb"+ (index+1);
		parent.appendChild(img);

		img.onclick = function(){
			var active = parseInt(this.id.match(/(\d+)$/)[0]);
			doScroll(reveal(current, active)())
			current = active;
		}
	}

	function processImages(parent,image,index){
		var div = document.createElement("div");
		div.id = "normal" + (index +1);
		if (index+1 > 1) div.setAttribute("class",div.id);
		var img = document.createElement("img");
		img.src = image.getAttribute("url");
		img.alt = "";

		div.appendChild(img);

		parent.appendChild(div);
	}

	function goPrevious(){
		if (current-1 > 0) {
			active = current - 1;
			doScroll(reveal(current, --current)());
			updateOn(this);
		}
	}

	function goNext(){
		if (current+1 <= images.length) {
			active = current + 1;
			doScroll(reveal(current, ++current)());
			updateOn(this);
		}
	}

	function onMouseOver(){
		updateOn(this);
	}

	function onMouseOut() {
		updateOff(this);
	}

	function updateOn(elem){
		var nav = elem.getAttribute("nav");
		console.log("nav", nav);
		var prev = current-1, next = current+1;
		var validprev = prev <=0 && nav === "prev";
		var validnext = next > images.length && nav === "next";
		console.log("onupdate current", current,next, validprev, validnext);

		if (validprev || validnext){
			updateOff(elem);
			return;
		}
			
		elem.style.cssText = "filter: alpha(opacity=50); opacity: 0.5; cursor: pointer;"
		
	}

	function updateOff(elem){
		elem.style.cssText = "filter: alpha(opacity=0); opacity: 0; cursor: default;"
	}

	function reveal(current, active){
		 var i = current, j = active;
		 var elem = function() { 
		 	document.getElementById("normal" + i).style.display = "none";
		 	document.getElementById("normal" + j).style.display = "block";

		 	//update thumbnail decoration
		 	var thumb = document.getElementById("thumb"+j);
		 	thumb.style.border = "2px solid #CC0D0D";
			//document.getElementById("thumb"+j).style.border = "2px solid #CC0D0D";  //("class", "highlight");
			document.getElementById("thumb"+i).style.border = "2px solid #000";  //("class", "zilch");

			return thumb;
		 }
		 return elem; 
	}

	function doScroll(elem){
		elem.scrollIntoView();
	}

})