if (Meteor.isClient)
{
	Template.splashPage.rendered = function()
	{ 
		var pC = $('#p1');
		generatePercentageCircle(pC[0], 90, 55, .91, '#3FA3BB', '#4C8A99', 5, "#FAF0CA");
		pC = $('#p2');
		generatePercentageCircle(pC[0], 90, 55, .94, '#D14628', '#A85443', 5, "#FAF0CA");
		pC = $('#p3');
		generatePercentageCircle(pC[0], 90, 55, .95, '#6BB145', '#5C8743', 5, "#FAF0CA");
		pC = $('#p4');
		generatePercentageCircle(pC[0], 90, 55, .92, '#F0B21A', '#CCA241', 5, "#FAF0CA");
	};

	Template.mainView.helpers({
		overlayVisibility: function()
		{
			if(Session.get('showEditAssessmentPanel') || Session.get('showCreateClassPanel'))
			{
				return 'block';
			}
			else
			{
				return 'none';
			}
		}

		, editingAssessmentVisibility: function()
		{
			return Session.get('showEditAssessmentPanel') ? 'block' : 'none';
		}

		, createClassVisibility: function()
		{
			return Session.get('showCreateClassPanel') ? 'block' : 'none';
		}

		, checkIfViewingClass: function()
		{
			return (this.classes);
		}

		, ccawt : function()
		{
			return Session.get('ccawt');
		}
	});

	Template.mainView.events({
		'click #overlay' : function(event)
		{
			if($(event.target).attr("id") == "overlay"){
				event.thing = true;
				Session.set('showEditAssessmentPanel', false);
				Session.set('showCreateClassPanel', false);
			}
		}

		, 'click #editAssessmentPanel' : function(event)
		{

		}

		, 'click #editKnowledgeEnabled' : function(event)
		{

		}

		, 'click #editThinkingEnabled' : function(event)
		{

		}

		, 'click #editCommunicationEnabled' : function(event)
		{

		}

		, 'click #editApplicationEnabled' : function(event)
		{
			
		}

		, 'click .class' : function(event)
		{
			if($(event.target).attr("class") != "classRemove")
			{
				// TODO Route the user to the class
			}
		}

		, 'click #classCreate' : function(event)
		{
			Session.set('showCreateClassPanel', true);
			Session.set('ccawt', []);
			$('#createClassNameField')[0].value = '[Class Name Here]';
			$('#createClassKnowledgeInput')[0].value = '25';
			$('#createClassThinkingInput')[0].value = '25';
			$('#createClassCommunicationInput')[0].value = '25';
			$('#createClassApplicationInput')[0].value = '25';
		}

		, 'click #createCCAWT' : function(event)
		{
			var n = Session.get('ccawt').slice(0);
			n.push({ ccawtName: "Test", ccawtWeight: 1, categories: ["knowledge", "thinking", "communication", "application"], rID: Math.floor(Math.random() * 10000) });
			Session.set('ccawt', n);
		}

		, 'click #createClassButton' : function(event)
		{
			
		}
	});

	Template.ccawtTemplate.helpers({
		ccawtKHelper: function()
		{
			return (this.categories.indexOf('knowledge') != -1 ? "checked" : "");
		}
		, ccawtTHelper: function()
		{
			return (this.categories.indexOf('thinking') != -1 ? "checked" : "");
		}
		, ccawtCHelper: function()
		{
			return (this.categories.indexOf('communication') != -1 ? "checked" : "");
		}
		, ccawtAHelper: function()
		{
			return (this.categories.indexOf('application') != -1 ? "checked" : "");
		}
	});

	Template.ccawtTemplate.events({
		'change .ccawtName': function(event)
		{
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					n[i].ccawtName = $(event.target)[0].value;
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'change .ccawtWeight': function(event)
		{
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					n[i].ccawtWeight = $(event.target)[0].value;
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'click .ccawtRemove': function(event)
		{
			var n = Session.get('ccawt').slice(0);
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					n.splice(i, 1);
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'click .ccawtK': function(event)
		{
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					if($(event.target)[0].checked)
					{
						n[i].categories.push("knowledge");
					}
					else
					{
						n[i].categories.splice(n[i].categories.indexOf("knowledge"), 1);
					}
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'click .ccawtT': function(event)
		{
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					if($(event.target)[0].checked)
					{
						n[i].categories.push("thinking");
					}
					else
					{
						n[i].categories.splice(n[i].categories.indexOf("thinking"), 1);
					}
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'click .ccawtA': function(event)
		{
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					if($(event.target)[0].checked)
					{
						n[i].categories.push("application");
					}
					else
					{
						n[i].categories.splice(n[i].categories.indexOf("application"), 1);
					}
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'click .ccawtC': function(event)
		{
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					if($(event.target)[0].checked)
					{
						n[i].categories.push("communication");
					}
					else
					{
						n[i].categories.splice(n[i].categories.indexOf("communication"), 1);
					}
					break;
				}
			}
			Session.set('ccawt', n);
		}
	});

	Template.mainContent.rendered = function()
	{
		var percentageCanvas = $('#percentage');
		generatePercentageCircle(percentageCanvas[0], 190, 130, .93, 'rgb(154,205,50)', 'rgb(119,157,38)', 5, '#FAF0CA');

		Session.set('classToSet', $('.class')[0]);
	};

	Template.mainContent.helpers({
		assessmentList: function()
		{
			var x = Assessments.find({"parentClassId": this.class._id}).fetch();
			console.log(x);
			return x;
		}
		, classList: function()
		{
			return Classes.find().fetch();
		}
	});

	Template.mainContent.events({
		'change #className': function(event)
		{
			Meteor.call("changeClassTitle", {classId: this.class._id, newTitle: $(event.target)[0].value});
		}
	});

	Template.assessment.helpers({
		assessmentKMark: function()
		{
			//return assessmentMark[0] / assessmentCategoryDenominators[0];
			return Math.floor(this.categoryPercentages[0]*100);
		}

		, assessmentCategoryCount: function()
		{
			return 4;
		}

		, assessmentKnowledgePercent: function()
		{
			console.log(this);
			return 1;//this.categoryPercentages[0];
		}

		, assessmentThinkingPercent: function()
		{
			return 1;//this.categoryPercentages[1];
		}

		, assessmentCommunicationPercent: function()
		{
			return 1;//this.categoryPercentages[3];
		}

		, assessmentApplicationPercent: function()
		{
			return 1;//this.categoryPercentages[2];
		}
	});

	Template.assessment.events({
		'click .assessmentEditSymbol' : function(event)
		{
			console.log(this);
			//Session.set('editingAssessmentId', )
			Session.set('showEditAssessmentPanel', true);
		}

		, 'click .assessmentRemoveSymbol' : function(event)
		{

		}
	});
}

function generatePercentageCircle(canvas, radius, clearRadius, percentage, colour, border, borderWidth, textColour)
{
	var c = canvas.getContext('2d');
	var centreX = canvas.width / 2;
	var centreY = canvas.height / 2;

	c.beginPath();
	c.arc(centreX, centreY, radius, -.5*Math.PI, (percentage) * 2 * Math.PI - .5*Math.PI);
	c.arc(centreX, centreY, clearRadius, (percentage) * 2 * Math.PI - .5*Math.PI, -.5*Math.PI, true);
	c.fillStyle = colour;
	c.strokeStyle = border;
	c.lineWidth = borderWidth;
	c.closePath();
	c.fill();
	c.stroke();
	c.font = "" + clearRadius * 1.5 + "px Arial";
	var percentText = Math.floor(percentage * 100) + "";
	var dim = c.measureText(percentText);
	c.fillStyle = textColour;
	c.fillText(percentText, centreX + dim.width / -2, centreY + clearRadius / 2);
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
