var drag =
{
  objects:[],
  canvas:null,
  obj:null,

  init : function(canvasId)
  {
    //define the givin canvas id
    drag.canvas = document.getElementById(canvasId);

    //show the ticket wrapper
    var wrapper = document.getElementById('wrapper');
    wrapper.style.display = "block";

    //edge & element size
    drag.defineVariables();

    //make the list of items operational
    var items = document.querySelectorAll('.item');

    for(var i =0; i<items.length; i++)
    {
        if(typeof items[i] != 'undefined')
            items[i].addEventListener("click", drag.generateItemFromListItem);
    }
  },

  defineVariables : function()
  {

  },


  removeObjectById : function(id)
  {
    for(var i in drag.objects)
    {
      var obj = drag.objects[i];
      if(obj.id == id)
        drag.objects.splice(i, 1);
    }
  },

  getObjectById : function(id)
  {
    for(var i in drag.objects)
    {
      var obj = drag.objects[i];
      if(obj.id == id)
        return obj;
    }

    return null;
  },

  generateItemFromListItem : function(e)
  {
      var oldId = e.currentTarget.id;
      var newId = oldId.split("-", 1);

    // if object with new ID doesnt exist, create it
    if ( document.getElementById(newId) == null )
    {
      drag.createElement(newId);
      drag.disableListItem(oldId);
    }
  },

  disableListItem : function(id)
  {
    var listItem = document.getElementById(id);
    listItem.classList.add('closed');
  },

  enableListItem : function(id)
  {
    var listItem = document.getElementById(id);
    listItem.classList.remove('closed');
  }, 

  createElement : function(id, x, y, width, height, align)
  {
    //if params are not given
    var x = (typeof x != 'undefined') ? x : 0;
    var y = (typeof y != 'undefined') ? y : 0;
    var width = (typeof width != 'undefined') ? width : 100;
    var height = (typeof height != 'undefined') ? height : 100;
    var align = (typeof align != 'undefined') ? align : "left";


      //create element
      var element = document.createElement('div');
      element.id = id;
      element.className = 'object';
      element.position = "absolute";

      //starting data
      element.style.fontWeight = "normal";
      element.style.width = width + "px";
      element.style.height = height + "px";
      element.style.left = 0 + "px";
      element.style.top = 0 + "px";
      element.style.textAlign = "left";

      drag.canvas.appendChild(element);
      drag.obj = element;
      element.addEventListener("mousedown",drag.selectElement);

      //log it to the objects array
      drag.updateObjectVariables(element);

        //toolbar show 'n hide listeners
        element.addEventListener("mouseover",drag.showToolbar);
        element.addEventListener("mouseout",drag.hideToolbar);


      //create the scalers
      var handlers = document.createElement('div');
      handlers.className = "handlers";
      element.appendChild(handlers);

        var scalers = ['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left'];

        for(var c = 0; c < scalers.length; c++)
        {
          var child = document.createElement('div');
          child.className = scalers[c];
          child.classList.add("scaler");
          child.position = "absolute";
          handlers.appendChild(child);
          child.addEventListener("mousedown", drag.startScale);
        }

        //create dragger
        var dragger = document.createElement('div');
        dragger.className = "drag";
        dragger.position = "absolute";
        handlers.appendChild(dragger);
        dragger.addEventListener("mousedown", drag.startDrag);

      //create toolbar
      var toolbar = document.createElement('ul');
      toolbar.className = "toolbar";
      toolbar.position = "absolute";
      element.appendChild(toolbar);

        //create toolbar items
        var toolbarItems = ['align-left','align-center','align-right','bold','close']

        for(var t = 0; t < toolbarItems.length; t++)
        {
          toolbarItem = document.createElement('li');
          toolbarItem.className = toolbarItems[t] + " itemBtn toolbar-item";
          toolbar.appendChild(toolbarItem);
          toolbarItem.addEventListener("mousedown", drag.toolbar);
        }

      //content
      var content = document.createElement('div');
      content.className = "content";
      element.appendChild(content);

        var span = document.createElement('span');
        span.innerHTML = 'Lorem ipsum!';
        content.appendChild(span);

    
    //position element
    drag.updateObject(id);

  },

  updateObject : function(id,x,y,width,height)
  {
    var object = document.getElementById(id);
    var sqr = drag.canvas.getBoundingClientRect();

    //get content
    var c1 = object.childNodes;
    var t1 = c1[2];
    var c2 = t1.childNodes;
    var span = c2[0];
    var spanWidth = span.offsetWidth;
    var spanHeight = span.offsetHeight;

    //calculate max
    var maxX = (drag.canvas.offsetWidth-object.offsetWidth);
    var maxY = (drag.canvas.offsetHeight-object.offsetHeight);

    if(x > maxX)
    {
      x = maxX;
    }
    else if(x < 0)
    {
      x = 0;
    }
    if (y > maxY)
    {
      y = maxY;
    }
    if (y < 0)
    {
      y = 0;
    }

    //min width & height
    if (width<spanWidth)
    {
      width=spanWidth;
    }
    if (height<spanHeight)
    {
      height=spanHeight;
    }

    //position object
    object.style.left = x + "px";
    object.style.top = y + "px";
    object.style.width = width + "px";
    object.style.height = height + "px";
  },

  selectElement : function(e)
  {
    //check for all the objects in the canvas
    var elements = document.querySelectorAll('.object');
    var currentElement = e.currentTarget;

    for(var i =0; i<elements.length; i++)
    {
      if(elements[i]==currentElement)
      {
        //color and bring to front
        elements[i].style.backgroundColor = "#6666cc";
        elements[i].style.zIndex = 10;
      }
      else
      {
        //color and bring to back
        elements[i].style.backgroundColor = "#333399";
        elements[i].style.zIndex = 1;
      }
    }    
  },

  startScale : function(e)
  {
    //get the object
    scaler = e.currentTarget;
    //get parent object
    drag.obj = scaler.parentElement.parentElement; 
    drag.direction = scaler.className;

    //add the mousemove listener and remover
    document.addEventListener('mousemove', drag.scaleObject);
    document.addEventListener("mouseup", drag.stopScale);

    //mouse off element toolbar debug
    drag.obj.removeEventListener("mouseout",drag.hideToolbar);
  },

  stopScale : function()
  {
    //stop scale on mouse up
    document.removeEventListener('mousemove', drag.scaleObject);
    document.removeEventListener("mouseup", drag.stopScale);

    //update the object data
    if (drag.obj != null)
    {
      drag.updateObjectVariables(drag.obj);
    }

    //mouse off element toolbar debug
    drag.obj.addEventListener("mouseout",drag.hideToolbar);
  },

  startDrag : function(e)
  {
    //get the object
    dragger = e.currentTarget;
    //get parent object
    drag.obj = dragger.parentElement.parentElement;
    var position = drag.obj.getBoundingClientRect();
    var relation = drag.canvas.getBoundingClientRect();

    //get mouse offset
    offsetX = e.pageX - position.left + relation.left;
    offsetY = e.pageY - position.top + relation.top;

    //add the mousemove listener and remover
    document.addEventListener('mousemove', drag.dragObject);
    document.addEventListener("mouseup", drag.stopDrag);
  },

  stopDrag : function()
  {
    //stop drag on mouse up
    document.removeEventListener('mousemove', drag.dragObject);
    document.removeEventListener("mouseup", drag.stopDrag);

    //update the object data
    if (drag.obj != null)
    {
      drag.updateObjectVariables(drag.obj);
    }
  },

  scaleObject : function(e)
  {
    //get mouse and object data
    var relation = drag.canvas.getBoundingClientRect();
    mouseX = e.pageX - relation.left;
    mouseY = e.pageY - relation.top;

    var x = drag.getObjectById(drag.obj.id).x;
    var y = drag.getObjectById(drag.obj.id).y;
    var width = drag.getObjectById(drag.obj.id).width;
    var height = drag.getObjectById(drag.obj.id).height;

    //canvas edges
    var rightEdge = (relation.right - relation.left);
    var leftEdge = 0;
    var topEdge = 0;
    var bottomEdge = (relation.bottom - relation.top);

    //mouseX max and min
    if (mouseX > rightEdge)
    {
      mouseX = rightEdge;
    }
    if (mouseX < leftEdge)
    {
      mouseX = leftEdge;
    }
    if (mouseY > bottomEdge)
    {
      mouseY = bottomEdge;
    }
    if (mouseY < topEdge)
    {
      mouseY = topEdge;
    }

    //if object exists, do the scaling
    if (drag.obj != null)
    {
      switch (drag.direction)
      {
        //width and height
        case "top scaler":
            drag.updateObject(drag.obj.id,x,mouseY,width,(height+(y-mouseY)));
            break;
        case "bottom scaler":
            drag.updateObject(drag.obj.id,x,y,width,(mouseY-y));
            break;
        case "right scaler":
              drag.updateObject(drag.obj.id,x,y,(mouseX-x),height);
            break;
        case "left scaler":
            drag.updateObject(drag.obj.id,mouseX,y,(width+(x-mouseX)),height);
            break;
        case "top-right scaler":
            drag.updateObject(drag.obj.id,x,mouseY,(mouseX-x),(height+(y-mouseY)));
            break;
        case "bottom-right scaler":
            drag.updateObject(drag.obj.id,x,y,(mouseX-x),(mouseY-y));
            break;
        case "bottom-left scaler":
            drag.updateObject(drag.obj.id,mouseX,y,(width+(x-mouseX)),(mouseY-y));
            break;
        case "top-left scaler":
            drag.updateObject(drag.obj.id,mouseX,mouseY,(width+(x-mouseX)),(height+(y-mouseY)));
            break;
        default:
            break;
      }
    }
  },

  dragObject : function(e)
  {
    //get mouse and object data
    mouseX = e.pageX;
    mouseY = e.pageY;

    //update the object
    drag.updateObject(drag.obj.id,(mouseX-offsetX),(mouseY-offsetY));
  },

  updateObjectVariables : function(update)
  {
    //get new stats
    x = update.offsetLeft;
    y = update.offsetTop;
    width = update.offsetWidth;
    height = update.offsetHeight;
    align = update.style.textAlign;
    weight = update.style.fontWeight;

    //redefine object
    object = 
    {
      id: update.id,
      x: x,
      y: y,
      width: width,
      height: height,
      align: align,
      weight: weight
    }

    if (drag.obj != null)
    {
      //check for objects existance
      if (drag.getObjectById(update.id) != null)
      {
        drag.removeObjectById(update.id);
      }

      //push it to the objects array
      drag.objects.push(object);
    }

  },

  toolbar : function(e)
  {
    //check what button is pressed
    var buttonPressedLong = e.currentTarget.className;
    var buttonPressed = buttonPressedLong.split(" ", 1);

    //get parent element
    parent = e.currentTarget.parentElement.parentElement;

    //get associated list item
    var listItemId = parent.id + "-list";

    //button action
    switch (buttonPressed[0])
    {
      case "align-left":
          parent.style.textAlign = "left";
          break;
      case "align-center":
          parent.style.textAlign = "center";
          break;
      case "align-right":
          parent.style.textAlign = "right";
          break;
      case "bold":
          if (drag.getObjectById(parent.id).weight == "normal")
          {
            parent.style.fontWeight = "bold";
          }
          else
          {
            parent.style.fontWeight = "normal";
          }
          break;
      case "close":
          drag.deleteObject(parent);
          drag.enableListItem(listItemId);
          break;
      default:
          break;
    }

    //opdate object
    drag.updateObjectVariables(parent);

  },

  showToolbar : function(e)
  {
    //get toolbar element
    children = e.currentTarget.childNodes;
    toolbar = children[1];
    toolbar.style.display = "block";   
  },

  hideToolbar : function(e)
  {
    //get toolbar element
    children = e.currentTarget.childNodes;
    toolbar = children[1];
    toolbar.style.display = "none";  
  },

  deleteObject : function(element)
  {
    //remove from the dom
    drag.canvas.removeChild(element);

    //remove from the objects array
    drag.removeObjectById(element.id);

    drag.obj = null;
    
  }

}