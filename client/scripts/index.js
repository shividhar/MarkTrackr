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

		classList: function()
		{
			return Classes.find().fetch();
		}
		, overlayVisibility: function()
		{
			if(Session.get('showEditAssessmentPanel') || Session.get('showEditClassPanel') || Session.get('showCreateClassPanel') || Session.get('showCreateAssessmentPanel'))
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
		, editingClassVisibility: function()
		{
			return Session.get('showEditClassPanel') ? 'block' : 'none';
		}

		, createClassVisibility: function()
		{
			return Session.get('showCreateClassPanel') ? 'block' : 'none';
		}
		, createAssessmentVisibility: function()
		{
			return Session.get('showCreateAssessmentPanel') ? 'block' : 'none';
		}

		, checkIfViewingClass: function()
		{
			return (this.classes);
		}

		, ccawt : function()
		{
			return Session.get('ccawt');
		}

		, editingAssessmentWeightTypeOptions: function()
		{
			return Classes.findOne({_id: this.classes._id}).assessmentTypes;
		}
	});

	Template.mainView.events({
		'click #overlay' : function(event)
		{
			if($(event.target).attr("id") == "overlay"){
				event.thing = true;
				Session.set('showEditAssessmentPanel', false);
				Session.set('showEditClassPanel', false);
				Session.set('showCreateClassPanel', false);
				Session.set('showCreateAssessmentPanel', false);
			}
		}

		, 'click #editAssessmentPanel' : function(event)
		{

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
			var x = Session.get('ccawt')
			if(x == undefined || x == null || x.length <= 0)
			{
				$('#createClassError')[0].innerHTML = "No assessments types defined!";
				return;
			}
			var k = Number($('#createClassKnowledgeInput')[0].value);
			var t = Number($('#createClassThinkingInput')[0].value);
			var c = Number($('#createClassCommunicationInput')[0].value);
			var a = Number($('#createClassApplicationInput')[0].value);
			if(k < 0 || t < 0 || c < 0 || a < 0)
			{
				$('#createClassError')[0].innerHTML = "Some category percentages are negative!";
				return;
			}
			if(k + t + c + a != 100)
			{
				$('#createClassError')[0].innerHTML = "Category percentages do not add up to 100%!";
				return;
			}
			var n = $('#createClassNameField')[0].value;
			if(n == "")
			{
				$('#createClassError')[0].innerHTML = "Class name is blank!";
				return;
			}
			var at = [];
			for(var i = 0; i < x.lenght; i++)
			{
				var xn = x.ccawtName;
				if(xn == "")
				{
					$('#createClassError')[0].innerHTML = "Assessment type name is blank! How did you manage that...?";
					return;
				}
				var xw = x.ccawtWeight;
				if(xw == "")
				{
					$('#createClassError')[0].innerHTML = "Assessment weight is blank! How did you manage that...?";
					return;
				}
				if(xw == 0)
				{
					$('#createClassError')[0].innerHTML = "Assessment weight is zero! How did you manage that...?";
					return;
				}
				at[i] = { typeName: xn, weight: xw, categories: x.categories };
			}
			Meteor.call('createClass', {title: n, categoryWeightings: [k, t, a, c], assessmentTypes: at}, function(error, result){
				if(error)
				{
					$('#createClassError')[0].innerHTML = "" + error;
					return;
				}
				else
				{
					Session.set('showCreateClassPanel', false);
					Router.go("classPage", {"classId": result});
					return;
				}
			});
		}
	});

	Template.classElement.events({
		'click .class' : function(event)
		{
			if($(event.target).attr("class") != "classRemoveSVG")
			{
				// TODO Route the user to the class
				Router.go("classPage", {"classId": this._id});
			}
		}
		, 'click .classRemoveSVG' : function(event, template)
		{
			if(Router.current().data().classes._id == this._id)
			{
				Meteor.call("deleteClass", {classId: this._id}, function(error)
				{
					if(error)
					{
						console.log(error);
					}
					else
					{
						Router.go("splashPage");
					}
				});
			}
			else
			{
				Meteor.call("deleteClass", {classId: this._id}, function(error)
				{
					if(error)
					{
						console.log(error);
					}
				});
			}
			//Router.go("classPage", {"classId": this._id});
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
			if($(event.target)[0].value == "")
			{
				$(event.target)[0].value = this.ccawtName;
			}
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
			var val = Number($(event.target)[0].value);
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target)[0].value = val;
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
						var x = n[i].categories.indexOf("knowledge");
						if(x == -1)
						{
							n[i].categories.push("knowledge");
						}
					}
					else
					{
						var x = n[i].categories.indexOf("knowledge");
						if(x != -1)
						{
							n[i].categories.splice(x, 1);
						}
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
						var x = n[i].categories.indexOf("thinking");
						if(x == -1)
						{
							n[i].categories.push("thinking");
						}
					}
					else
					{
						var x = n[i].categories.indexOf("thinking");
						if(x != -1)
						{
							n[i].categories.splice(x, 1);
						}
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
						var x = n[i].categories.indexOf("application");
						if(x == -1)
						{
							n[i].categories.push("application");
						}
					}
					else
					{
						var x = n[i].categories.indexOf("application");
						if(x != -1)
						{
							n[i].categories.splice(x, 1);
						}
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
						var x = n[i].categories.indexOf("communication");
						if(x == -1)
						{
							n[i].categories.push("communication");
						}
					}
					else
					{
						var x = n[i].categories.indexOf("communication");
						if(x != -1)
						{
							n[i].categories.splice(x, 1);
						}
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
			var x = Assessments.find({"parentClassId": this.classes._id}).fetch();
			return x;
		}
		, className: function()
		{
			return Classes.findOne({_id:this.classes._id}).title;
		}
	});

	Template.mainContent.events({
		'change #className': function(event)
		{
			Meteor.call("changeClassTitle", {classId: this.classes._id, newTitle: $(event.target)[0].value});
		}
		, 'click #assessmentCreate': function(event)
		{
			//Meteor.call("createAssessment", {title: "AssessmentSmith", parentClassId: this.classes._id, type: })
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
			//Session.set('editingAssessmentId', )
			Session.set('showEditAssessmentPanel', true);
			$('#editAssessmentNameField')[0].value = this.title;
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
