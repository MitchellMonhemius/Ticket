var upload = {

  // getElementById
  $id : function(id)
  {
    return document.getElementById(id);
  },

  // output information
  Output : function(msg)
  {
    var m = upload.$id("messages");
    m.innerHTML = msg + m.innerHTML;
  },

  // initialize
  init : function()
  {
    var fileselect = upload.$id("fileselect"),
    filedrag = upload.$id("filedrag"),
    submitbutton = upload.$id("submitbutton");

    // file select
    fileselect.addEventListener("change", upload.FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload)
    {
    
      // file drop
      filedrag.addEventListener("dragover", upload.FileDragHover, false);
      filedrag.addEventListener("dragleave", upload.FileDragHover, false);
      filedrag.addEventListener("drop", upload.FileSelectHandler, false);
      filedrag.style.display = "block";
      
      // remove submit button
      //submitbutton.style.display = "none";
    }
  },

  // file drag hover
  FileDragHover : function(e)
  {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
  },

  // file selection
  FileSelectHandler : function(e)
  {

    // cancel event and hover styling
    upload.FileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f; f = files[i]; i++)
    {
      upload.ParseFile(f);
    }
  },

  ParseFile :function(file)
  {

    upload.Output(
      "<p>File information: <strong>" + file.name +
      "</strong> type: <strong>" + file.type +
      "</strong> size: <strong>" + file.size +
      "</strong> bytes</p>"
    );

    // display an image
    if (file.type.indexOf("image") == 0)
    {
      var reader = new FileReader();
      reader.onload = function(e)
      {
        //init the Experticketing Styler 4000 Extreme (q)
        drag.init("ticket");

        upload.Output('<img id="ticket-image" src="' + e.target.result + '" />');
        var ticketImage = document.getElementById("ticket-image");
        drag.canvas.appendChild(ticketImage);
      }
      reader.readAsDataURL(file);
    }
  }  
}














