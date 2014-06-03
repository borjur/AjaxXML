var ELEMENT_NODE = 1; 
var ATTRIBUTE_NODE = 2; 
var TEXT_NODE = 3; 
var CDATA_SECTION_NODE = 4; 
var ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = 12;

/*
	Function Name: AttachEvent
	Arguments: OBJ,EVT,FNCT
	Action: cross browser: attaches event to passed in object.  FNCT will be the event's callback function.
	Returns: true on success
*/

function AttachEvent(OBJ,EVT,FNCT)
{
	if (OBJ.addEventListener)
	{
		OBJ.addEventListener(EVT,FNCT,false);
		return true;
	} 
	else if (OBJ.attachEvent) 
	{
		return OBJ.attachEvent("on"+EVT,FNCT);
	}
}

/*
	Function Name: RemoveTextNodes
	Arguments: NODE
	Action: Removes all child "empty" text nodes from an element. Allows for recursive removal.
	Returns: nothing
	Notes: The purpose of this function it to equalize the Mozilla and IE DOMs.
*/ 
function RemoveTextNodes(NODE,RECURSIVE)
{
	var ChildNode;
	for (var i=NODE.childNodes.length-1; i>=0; i--)
	{
		ChildNode = NODE.childNodes[i];
		if (ChildNode.nodeType == TEXT_NODE && !(/\S/.test(ChildNode.nodeValue)))
		{
			NODE.removeChild(ChildNode);
		}
		else if (RECURSIVE && ChildNode.hasChildNodes())
		{
			RemoveTextNodes(ChildNode,true);
		}
	}
}

/*
	Function Name: GetElementsByClassName
	Arguments: CLASS,NODE
	Action: Finds all elements that are descendants of NODE of the CLASS class.
	Returns: an array of elements that are descendants of NODE of the CLASS class
*/ 
function GetElementsByClassName(CLASS,NODE)
{
	var startNode = NODE || document;
	var AllTags = startNode.getElementsByTagName("*");
	if (AllTags.length == 0) AllTags = startNode.all; //for IE
	var Elems = new Array();
	var re = new RegExp("(^|\\s+)" + CLASS + "(\\s+|$)");
	for (var i=0; i<AllTags.length; i++)
	{
		if (re.test(AllTags[i].className)) Elems[Elems.length] = AllTags[i];
	}
	return Elems;
}
	
/*
	Function Name: DomDoc
	Arguments: FILE,ASYNC
	Action: Creates and loads and DOM Document
	Returns: The loaded DOM Document
*/ 
function DomDoc(FILE,ASYNC)
{
	var Doc;
	try
	{
		Doc = document.implementation.createDocument("", "", null);
	}
	catch (exc)
	{
		Doc = new ActiveXObject("Microsoft.XMLDOM"); 
	}
	if (typeof ASYNC != "undefined") Doc.async=ASYNC;
	Doc.load(FILE);
	return Doc;
}

/*
	Function Name: AddChild
	Arguments: DOC, PARENT, CHILD, CHILDTEXT?, ATTRIBUTES?
	Action: Creates a child element in the DOC DOM and appends it to PARENT
			CHILD can be an element node or a string name of an element node-to-be
	Returns:
		New child element
*/
function AddChild(DOC, PARENT, CHILD, CHILDTEXT, ATTRIBUTES)
{
	var	ChildElement;
	if (typeof(CHILD) == "string")
	{
		ChildElement = DOC.createElement(CHILD);
	}
	else
	{
		ChildElement = CHILD;
	}
	
	if (typeof CHILDTEXT != "undefined" && CHILDTEXT != null)
	{
		var ChildText = DOC.createTextNode(CHILDTEXT);
		ChildElement.appendChild(ChildText);
	}
	
	if (typeof ATTRIBUTES != "undefined")
	{
		var Attributes = ATTRIBUTES;
		for (Att in Attributes)
		{
			ChildElement.setAttribute(Att,Attributes[Att]);	
		}
	}
	
	PARENT.appendChild(ChildElement);
	return ChildElement;
}

/*
	Function Name: RemoveAllChildren
	Arguments: PARENT
	Action: Removes all of an element's children
	Returns: nothing
*/
function RemoveAllChildren(PARENT)
{	
	while (PARENT.hasChildNodes())
	{
		PARENT.removeChild(PARENT.childNodes[0]);
	}
}