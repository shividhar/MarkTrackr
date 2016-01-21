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

		, ecawt : function()
		{
			return Session.get('ecawt');
		}

		, editingAssessmentWeightTypeOptions: function()
		{
			if(this.classes)
			{
				return Classes.findOne({_id: this.classes._id}).assessmentTypes;
			}
			else
			{
				return [];
			}
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

		, 'click #classCreate' : function(event)
		{
			Session.set('showCreateClassPanel', true);
			Session.set('ccawt', []);
			$('#createClassNameField').val('[Class Name Here]');
			$('#createClassKnowledgeInput').val('25');
			$('#createClassThinkingInput').val('25');
			$('#createClassCommunicationInput').val('25');
			$('#createClassApplicationInput').val('25');
		}

		, 'click #createCCAWT' : function(event)
		{
			var n = Session.get('ccawt').slice(0);
			n.push({ ccawtName: "Test", ccawtWeight: 1, categories: ["knowledge", "thinking", "communication", "application"], rID: Math.floor(Math.random() * 10000) });
			Session.set('ccawt', n);
		}

		, 'click #createClassButton' : function(event)
		{
			var x = Session.get('ccawt');
			if(x == undefined || x == null || x.length <= 0)
			{
				$('#createClassError').html("No assessments types defined!");
				return;
			}
			var k = Number($('#createClassKnowledgeInput').val());
			var t = Number($('#createClassThinkingInput').val());
			var c = Number($('#createClassCommunicationInput').val());
			var a = Number($('#createClassApplicationInput').val());
			if(k < 0 || t < 0 || c < 0 || a < 0)
			{
				$('#createClassError').html("Some category percentages are negative!");
				return;
			}
			if(k + t + c + a != 100)
			{
				$('#createClassError').html("Category percentages do not add up to 100%!");
				return;
			}
			var n = $('#createClassNameField').val();
			if(n == "")
			{
				$('#createClassError').html("Class name is blank!");
				return;
			}
			console.log(x);
			var at = [];
			for(var i = 0; i < x.length; i++)
			{
				var xn = x[i].ccawtName;
				console.log(xn);
				if(xn == "")
				{
					$('#createClassError').html("Assessment type name is blank! How did you manage that...?");
					return;
				}
				var xw = x[i].ccawtWeight;
				if(xw == "")
				{
					$('#createClassError').html("Assessment weight is blank! How did you manage that...?");
					return;
				}
				if(xw == 0)
				{
					$('#createClassError').html("Assessment weight is zero! How did you manage that...?");
					return;
				}
				at[i] = { typeName: xn, weight: xw, categories: x[i].categories };
			}
			console.log(at);
			Meteor.call('createClass', {title: n, categoryWeightings: [k, t, a, c], assessmentTypes: at}, function(error, result){
				if(error)
				{
					$('#createClassError').html("" + error);
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
		, 'change #createKnowledgePercent' : function(event)
		{
			var val = Number($(event.target).val());
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target).val(val);
		}
		, 'change #createThinkingPercent' : function(event)
		{
			var val = Number($(event.target).val());
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target).val(val);
		}
		, 'change #createCommunicationPercent' : function(event)
		{
			var val = Number($(event.target).val());
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target).val(val);
		}
		, 'change #createApplicationPercent' : function(event)
		{
			var val = Number($(event.target).val());
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target).val(val);
		}
		, 'change #createAssessmentWeightField': function(event)
		{
			var assessmentTypes = Classes.findOne({_id: this.classes._id}).assessmentTypes;
			for(var i = 0; i < assessmentTypes.length; i++)
			{
				if(assessmentTypes[i].typeName == $(event.target).val())
				{
					$('#createKnowledge').css('background-color', (assessmentTypes[i].categories.indexOf('knowledge') != -1 ? '#6BB145': '#9CAF92'));
					$('#createThinking').css('background-color', (assessmentTypes[i].categories.indexOf('thinking') != -1 ? '#F0B21A': '#EFD594'));
					$('#createCommunication').css('background-color', (assessmentTypes[i].categories.indexOf('communication') != -1 ? '#3FA3BB': '#87B0BA'));
					$('#createApplication').css('background-color', (assessmentTypes[i].categories.indexOf('application') != -1 ? '#D14628': '#D19183'));
					
					$('#createKnowledgePercent').prop('disabled', assessmentTypes[i].categories.indexOf('knowledge') == -1);
					$('#createThinkingPercent').prop('disabled', assessmentTypes[i].categories.indexOf('thinking') == -1);
					$('#createCommunicationPercent').prop('disabled', assessmentTypes[i].categories.indexOf('communication') == -1);
					$('#createApplicationPercent').prop('disabled', assessmentTypes[i].categories.indexOf('application') == -1);
					break;
				}
			}
		}
		
		, 'click #createAssessmentButton': function(event)
		{
			var n = $('#createAssessmentNameField').val();
			if(n == "")
			{
				$('createAssessmentError').html('Assessment name is blank! How did you manage that...?');
				return;
			}
			var at = undefined;
			var assessmentTypes = Classes.findOne({_id: this.classes._id}).assessmentTypes;
			for(var i = 0; i < assessmentTypes.length; i++)
			{
				if(assessmentTypes[i].typeName == $('#createAssessmentWeightField').val())
				{
					at = assessmentTypes[i];
					break;
				}
			}
			if(at == undefined)
			{
				$('createAssessmentError').html('Invalid assessment type! How did you manage that...?');
				return;
			}
			var cats = [];
			for(var i = 0; i < at.categories.length; i++)
			{
				if(at.categories[i] == "knowledge")
				{
					cats.push($('#createKnowledgePercent').val());
				}
				if(at.categories[i] == "thinking")
				{
					cats.push($('#createThinkingPercent').val());
				}
				if(at.categories[i] == "communication")
				{
					cats.push($('#createCommunicationPercent').val());
				}
				if(at.categories[i] == "application")
				{
					cats.push($('#createApplicationPercent').val());
				}
			}
			var t = this;
			Meteor.call("createAssessment", {title: n, parentClassId: this.classes._id, type: at.typeName, weight: at.weight, categories: at.categories, categoryPercentages: cats}, function(error){
				if(error)
				{
					$('#createAssessmentError').html("" + error);
					return;
				}
				else
				{
					Session.set('showCreateAssessmentPanel', false);
					calculatePercentages(t);
				}
			});
		}
		
		, 'change #editAssessmentWeightField' : function(event)
		{
			var assessmentTypes = Classes.findOne({_id: /*Router.current().data().classes._id*/this.classes._id}).assessmentTypes;
			for(var i = 0; i < assessmentTypes.length; i++)
			{
				if(assessmentTypes[i].typeName == $(event.target).val())
				{
					var at = assessmentTypes[i];
					
					$('#editKnowledge').css('background-color', (at.categories.indexOf('knowledge') != -1 ? '#6BB145': '#9CAF92'));
					$('#editThinking').css('background-color', (at.categories.indexOf('thinking') != -1 ? '#F0B21A': '#EFD594'));
					$('#editCommunication').css('background-color', (at.categories.indexOf('communication') != -1 ? '#3FA3BB': '#87B0BA'));
					$('#editApplication').css('background-color', (at.categories.indexOf('application') != -1 ? '#D14628': '#D19183'));
					
					$('#editKnowledgePercent').prop('disabled', at.categories.indexOf('knowledge') == -1);
					$('#editThinkingPercent').prop('disabled', at.categories.indexOf('thinking') == -1);
					$('#editCommunicationPercent').prop('disabled', at.categories.indexOf('communication') == -1);
					$('#editApplicationPercent').prop('disabled', at.categories.indexOf('application') == -1);
					
					var cats = [];
					for(var j = 0; j < at.categories.length; j++)
					{
						if(at.categories[j] == "knowledge")
						{
							cats.push($('#editKnowledgePercent').val());
						}
						if(at.categories[j] == "thinking")
						{
							cats.push($('#editThinkingPercent').val());
						}
						if(at.categories[j] == "communication")
						{
							cats.push($('#editCommunicationPercent').val());
						}
						if(at.categories[j] == "application")
						{
							cats.push($('#editApplicationPercent').val());
						}
					}
					var t = this;
					Meteor.call('changeAssessmentType', {assessmentId: Session.get('editingAssessmentId')._id, parentClassId: Session.get('editingAssessmentId').parentClassId, newAssessmentType: $(event.target).val(), newAssessmentCategoryPercentages: cats }, function(err){
						if(!err){
							calculatePercentages(t);
						}
					});
					
					break;
				}
			}
		}
		
		, 'change .editAssessmentPercent': function(event)
		{
			var assessmentTypes = Classes.findOne({_id: /*Router.current().data().classes._id*/this.classes._id}).assessmentTypes;
			for(var i = 0; i < assessmentTypes.length; i++)
			{
				if(assessmentTypes[i].typeName == $('#editAssessmentWeightField').val())
				{
					var at = assessmentTypes[i];
					
					var cats = [];
					for(var j = 0; j < at.categories.length; j++)
					{
						if(at.categories[j] == "knowledge")
						{
							cats.push($('#editKnowledgePercent').val());
						}
						if(at.categories[j] == "thinking")
						{
							cats.push($('#editThinkingPercent').val());
						}
						if(at.categories[j] == "communication")
						{
							cats.push($('#editCommunicationPercent').val());
						}
						if(at.categories[j] == "application")
						{
							cats.push($('#editApplicationPercent').val());
						}
					}
					var t = this;
					Meteor.call('changeAssessmentCategoryPercentages', {assessmentId: Session.get('editingAssessmentId')._id, newCategoryPercentages: cats }, function(error){
						if(error)
						{
							console.log(error);
						}
						else
						{
							calculatePercentages(t);
						}
					});
					return;
				}
			}
		}

		, 'change #editAssessmentNameField': function(event)
		{
			var n = $('#editAssessmentNameField').val();
			if(n == "")
			{
				$('#editAssessmentNameField').val(Session.get('editingAssessmentId').title);
				return;
			}
			else
			{
				Meteor.call('changeAssessmentTitle', {assessmentId: Session.get('editingAssessmentId')._id, newTitle: n}, function(error)
				{
					if(error)
					{
						console.log(error);
						$('#editAssessmentNameField').val(Session.get('editingAssessmentId').title);
					}else{
						Session.set('showEditAssessmentPanel', false);
					}
				});
			}
		}
		
		, 'change #editClassNameField': function(event)
		{
			var n = $('#editClassNameField').val();
			if(n == "")
			{
				$('#editClassNameField').val(Classes.findOne({_id: this.classes._id}).title);
				return;
			}
			else
			{
				Meteor.call('changeClassTitle', {classId: this.classes._id, newTitle: n}, function(error)
				{
					if(error)
					{
						console.log(error);
						$('#editClassNameField').val(Classes.findOne({_id: this.classes._id}).title);
					}
				});
			}
		}
		
		, 'change #editClassKnowledgeInput': function(event)
		{
			var v = Number($(event.target).val());
			if(v < 0)
			{
				v = Math.abs(v);
			}
			if(v == 0)
			{
				v = Classes.findOne({_id: this.classes._id}).categoryWeightings[0];
			}
			$(event.target).val(v);
			
			var t = this;
			Meteor.call('changeClassCategoryWeighting', {classId: this.classes._id, categoryName: "knowledge", categoryWeightToChange: v}, function(error)
			{
				if(error)
				{
					$('#editClassError').html(''+error);
					$(event.target).val(Classes.findOne({_id: this.classes._id}).categoryWeightings[0]);
					return;
				}
				else
				{
					calculatePercentages(t);
				}
			});
		}
		
		, 'change #editClassThinkingInput': function(event)
		{
			var v = Number($(event.target).val());
			if(v < 0)
			{
				v = Math.abs(v);
			}
			if(v == 0)
			{
				v = Classes.findOne({_id: this.classes._id}).categoryWeightings[1];
			}
			$(event.target).val(v);
			var t = this;
			Meteor.call('changeClassCategoryWeighting', {classId: this.classes._id, categoryName: "thinking", categoryWeightToChange: v}, function(error)
			{
				if(error)
				{
					$('#editClassError').html(''+error);
					$(event.target).val(Classes.findOne({_id: this.classes._id}).categoryWeightings[1]);
					calculatePercentages(t);
					return;
				}
			});
		}
		
		, 'change #editClassCommunicationInput': function(event)
		{
			var v = Number($(event.target).val());
			if(v < 0)
			{
				v = Math.abs(v);
			}
			if(v == 0)
			{
				v = Classes.findOne({_id: this.classes._id}).categoryWeightings[3];
			}
			$(event.target).val(v);
			var t = this;
			Meteor.call('changeClassCategoryWeighting', {classId: this.classes._id, categoryName: "communication", categoryWeightToChange: v}, function(error)
			{
				if(error)
				{
					$('#editClassError').html(''+error);
					$(event.target).val(Classes.findOne({_id: this.classes._id}).categoryWeightings[3]);
					calculatePercentages(t);
					return;
				}
			});
		}
		
		, 'change #editClassApplicationInput': function(event)
		{
			var v = Number($(event.target).val());
			if(v < 0)
			{
				v = Math.abs(v);
			}
			if(v == 0)
			{
				v = Classes.findOne({_id: this.classes._id}).categoryWeightings[2];
			}
			$(event.target).val(v);
			var t = this;
			Meteor.call('changeClassCategoryWeighting', {classId: this.classes._id, categoryName: "application", categoryWeightToChange: v}, function(error)
			{
				if(error)
				{
					$('#editClassError').html(''+error);
					$(event.target).val(Classes.findOne({_id: this.classes._id}).categoryWeightings[2]);
					calculatePercentages(t);
					return;
				}
			});
		}
		
		, 'click #editCCAWT': function(event)
		{
			Meteor.call("addAssessmentType", {classId: this.classes._id, newAssessmentType: { typeName: "[Change This Name]", weight: 1, categories: ["knowledge", "thinking", "communication", "application"]}}, function(error){
				if(error)
				{
					console.log(error);
				}
				else
				{
					var n = Session.get('ecawt').slice(0);
					n.push({ ecawtName: "[Change This Name]", ecawtWeight: 1, categories: ["knowledge", "thinking", "communication", "application"], rID: Math.floor(Math.random() * 10000) });
					Session.set('ecawt', n);
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
			if(confirm("Are you sure you want to delete this class?")){
				if(!Router.current().data || Router.current().data().classes._id == this._id)
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
			}
			event.preventDefault()
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

	Template.ecawtTemplate.helpers({
		ecawtKHelper: function()
		{
			return (this.categories.indexOf('knowledge') != -1 ? "checked" : "");
		}
		, ecawtTHelper: function()
		{
			return (this.categories.indexOf('thinking') != -1 ? "checked" : "");
		}
		, ecawtCHelper: function()
		{
			return (this.categories.indexOf('communication') != -1 ? "checked" : "");
		}
		, ecawtAHelper: function()
		{
			return (this.categories.indexOf('application') != -1 ? "checked" : "");
		}
	});

	Template.ccawtTemplate.events({
		'change .ccawtName': function(event)
		{
			if($(event.target).val() == "")
			{
				$(event.target).val(this.ccawtName);
			}
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					n[i].ccawtName = $(event.target).val();
					break;
				}
			}
			Session.set('ccawt', n);
		}
		, 'change .ccawtWeight': function(event)
		{
			var val = Number($(event.target).val());
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target).val(val);
			var n = Session.get('ccawt');
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					n[i].ccawtWeight = $(event.target).val();
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

	Template.ecawtTemplate.events({
		'change .ecawtName': function(event)
		{
			if($(event.target).val() == "")
			{
				$(event.target).val(this.ecawtName);
			}
			var t = this;
			Meteor.call('changeAssessmentTypeName', {classId: Router.current().data().classes._id, previousAssessmentTypeName: this.ecawtName, newAssessmentTypeName: $(event.target).val()}, function(error)
			{
				if(error)
				{
					$(event.target).val(t.ecawtName);
					console.log(error);
				}
				else
				{
					var n = Session.get('ecawt');
					for(var i = 0; i < n.length; i++)
					{
						if(n[i].rID == t.rID)
						{
							n[i].ecawtName = $(event.target).val();
							break;
						}
					}
					Session.set('ecawt', n);
				}
			});
		}
		, 'change .ecawtWeight': function(event)
		{
			var val = Number($(event.target).val());
			if(val < 0)
			{
				val = Math.abs(val);
			}
			if(val == 0)
			{
				val = 1;
			}
			$(event.target).val(val);
			var t = this;
			Meteor.call('changeAssessmentTypeWeighting', {classId: Router.current().data().classes._id, assessmentTypeName: this.ecawtName, newAssessmentTypeWeighting: val}, function(error)
			{
				if(error)
				{
					$(event.target).val(t.ecawtName);
					console.log(error);
				}
				else
				{
					var n = Session.get('ecawt');
					for(var i = 0; i < n.length; i++)
					{
						if(n[i].rID == t.rID)
						{
							n[i].ecawtWeight = val;
							break;
						}
					}
					Session.set('ecawt', n);
				}
			});
		}
		, 'click .ecawtRemove': function(event)
		{
			/*
			var n = Session.get('ecawt').slice(0);
			for(var i = 0; i < n.length; i++)
			{
				if(n[i].rID == this.rID)
				{
					n.splice(i, 1);
					break;
				}
			}
			Session.set('ecawt', n);*/
			var classes = Classes.findOne({_id: Router.current().data().classes._id});
			var t = this;
			for(var i = 0; i < classes.assessmentTypes.length; i++)
			{
				if(classes.assessmentTypes[i].typeName == this.ecawtName)
				{
					Meteor.call('deleteAssessmentType', {classId: Router.current().data().classes._id, assessmentTypeToDelete: classes.assessmentTypes[i] }, function(error){
						if(error)
						{
							$('editClassError').html(''+error);
							console.log(error);
						}
						else
						{
							var n = Session.get('ecawt').slice(0);
							for(var i = 0; i < n.length; i++)
							{
								if(n[i].rID == t.rID)
								{
									n.splice(i, 1);
									break;
								}
							}
							Session.set('ecawt', n);
						}
					});
					break;
				}
			}
			//Meteor.call('deleteAssessmentType', {classId: this.classes._id, assessmentTypeToDelete: })
		}
		, 'click .ecawtK': function(event)
		{
			/*
			var n = Session.get('ecawt');
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
			Session.set('ecawt', n);*/
			
			var n = Session.get('ecawt').slice(0);
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
					Meteor.call('changeAssessmentTypeCategory', {classId: Router.current().data().classes._id, assessmentTypeName: this.ecawtName, newAssessmentTypeCategories: n[i].categories}, function(error){
						if(error)
						{
							console.log(error);
							$('#editClassError').html('' + error);
						}
						else
						{
							Session.set('ecawt', n);
						}
					});
					break;
				}
			}
		}
		, 'click .ecawtT': function(event)
		{
						
			var n = Session.get('ecawt').slice(0);
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
					Meteor.call('changeAssessmentTypeCategory', {classId: Router.current().data().classes._id, assessmentTypeName: this.ecawtName, newAssessmentTypeCategories: n[i].categories}, function(error){
						if(error)
						{
							console.log(error);
							$('#editClassError').html('' + error);
						}
						else
						{
							Session.set('ecawt', n);
						}
					});
					break;
				}
			}
		}
		, 'click .ecawtA': function(event)
		{
			var n = Session.get('ecawt').slice(0);
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
					Meteor.call('changeAssessmentTypeCategory', {classId: Router.current().data().classes._id, assessmentTypeName: this.ecawtName, newAssessmentTypeCategories: n[i].categories}, function(error){
						if(error)
						{
							console.log(error);
							$('#editClassError').html('' + error);
						}
						else
						{
							Session.set('ecawt', n);
						}
					});
					break;
				}
			}
		}
		, 'click .ecawtC': function(event)
		{
			var n = Session.get('ecawt').slice(0);
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
					Meteor.call('changeAssessmentTypeCategory', {classId: Router.current().data().classes._id, assessmentTypeName: this.ecawtName, newAssessmentTypeCategories: n[i].categories}, function(error){
						if(error)
						{
							console.log(error);
							$('#editClassError').html('' + error);
						}
						else
						{
							Session.set('ecawt', n);
						}
					});
					break;
				}
			}
		}
	});

	Template.mainContent.rendered = function()
	{
		calculatePercentages(Router.current().data());
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
		, drawCanvas: function()
		{
			calculatePercentages(Router.current().data());
		}
	});

	Template.mainContent.events({
		"click #assessmentsTitle": function(event){
			var currentClassId = this.classes._id;

			
			return false
		},
		'change #className': function(event)
		{
			Meteor.call("changeClassTitle", {classId: this.classes._id, newTitle: $(event.target).val()});
		}
		, 'click #assessmentCreate': function(event)
		{
			Session.set("showCreateAssessmentPanel", true);
			var assessType = Classes.findOne({_id: this.classes._id}).assessmentTypes[0];
			$('#createAssessmentNameField').val('AssessmentSmith');
			$('#createAssessmentWeightField').val(assessType.typeName);
			$('#createKnowledgePercent').val('100');
			$('#createThinkingPercent').val('100');
			$('#createCommunicationPercent').val('100');
			$('#createApplicationPercent').val('100');
			
			$('#createKnowledge').css('background-color', (assessType.categories.indexOf('knowledge') != -1 ? '#6BB145': '#9CAF92'));
			$('#createThinking').css('background-color', (assessType.categories.indexOf('thinking') != -1 ? '#F0B21A': '#EFD594'));
			$('#createCommunication').css('background-color', (assessType.categories.indexOf('communication') != -1 ? '#3FA3BB': '#87B0BA'));
			$('#createApplication').css('background-color', (assessType.categories.indexOf('application') != -1 ? '#D14628': '#D19183'));
			
			$('#createKnowledgePercent').prop('disabled', assessType.categories.indexOf('knowledge') == -1);
			$('#createThinkingPercent').prop('disabled', assessType.categories.indexOf('thinking') == -1);
			$('#createCommunicationPercent').prop('disabled', assessType.categories.indexOf('communication') == -1);
			$('#createApplicationPercent').prop('disabled', assessType.categories.indexOf('application') == -1);
			//Meteor.call("createAssessment", {title: "AssessmentSmith", parentClassId: this.classes._id, type: })
		}
		, 'click #classEditSymbol': function(event)
		{
			Session.set('showEditClassPanel', true);
			var classData = Classes.findOne({_id: this.classes._id});

			$('#editClassNameField').val(classData.title);
			$('#editClassKnowledgeInput').val(classData.categoryWeightings[0]);
			$('#editClassThinkingInput').val(classData.categoryWeightings[1]);
			$('#editClassCommunicationInput').val(classData.categoryWeightings[3]);
			$('#editClassApplicationInput').val(classData.categoryWeightings[2]);

			var at = new Array(classData.assessmentTypes.length);
			for(var i = 0; i < at.length; i++)
			{
				at[i] = { ecawtName: classData.assessmentTypes[i].typeName, ecawtWeight: classData.assessmentTypes[i].weight, categories: classData.assessmentTypes[i].categories, rID: Math.floor(Math.random() * 10000) };
			}
			Session.set('ecawt', at);
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
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				return at[i].categories.length;
			}
			return 4;
		}

		, assessmentKnowledgePercent: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('knowledge');
				if(j != -1)
				{
					return (this.categoryPercentages[j]);
				}
			}
			return 0;
		}

		, assessmentThinkingPercent: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('thinking');
				if(j != -1)
				{
					return (this.categoryPercentages[j]);
				}
			}
			return 0;
		}

		, assessmentCommunicationPercent: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('communication');
				if(j != -1)
				{
					return (this.categoryPercentages[j]);
				}
			}
			return 0;
		}

		, assessmentApplicationPercent: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('application');
				if(j != -1)
				{
					return (this.categoryPercentages[j]);
				}
			}
			return 0;
		}
		
		, assessmentKDisplay: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('knowledge');
				if(j != -1)
				{
					return "block";
				}
			}
			return "none";
		}
		
		, assessmentTDisplay: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('thinking');
				if(j != -1)
				{
					return "block";
				}
			}
			return "none";
		}
		
		, assessmentCDisplay: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('communication');
				if(j != -1)
				{
					return "block";
				}
			}
			return "none";
		}
		
		, assessmentADisplay: function()
		{
			var at = Classes.findOne({_id: this.parentClassId}).assessmentTypes;
			var i = -1;
			for(var j = 0; j < at.length; j++)
			{
				if(at[j].typeName == this.type)
				{
					i = j;
					break;
				}
			}
			if(i != -1)
			{
				var j = at[i].categories.indexOf('application');
				if(j != -1)
				{
					return "block";
				}
			}
			return "none";
		}
	});

	Template.assessment.events({
		'click .assessmentEditSymbol' : function(event)
		{
			//Session.set('editingAssessmentId', )
			Session.set('showEditAssessmentPanel', true);
			$('#editAssessmentNameField').val(this.title);
			
			var assessmentTypes = Classes.findOne({_id: Router.current().data().classes._id}).assessmentTypes;
			for(var i = 0; i < assessmentTypes.length; i++)
			{
				if(assessmentTypes[i].typeName == this.type)
				{
					$('#editKnowledge').css('background-color', (assessmentTypes[i].categories.indexOf('knowledge') != -1 ? '#6BB145': '#9CAF92'));
					$('#editThinking').css('background-color', (assessmentTypes[i].categories.indexOf('thinking') != -1 ? '#F0B21A': '#EFD594'));
					$('#editCommunication').css('background-color', (assessmentTypes[i].categories.indexOf('communication') != -1 ? '#3FA3BB': '#87B0BA'));
					$('#editApplication').css('background-color', (assessmentTypes[i].categories.indexOf('application') != -1 ? '#D14628': '#D19183'));
					
					var ki = assessmentTypes[i].categories.indexOf('knowledge');
					var ti = assessmentTypes[i].categories.indexOf('thinking');
					var ci = assessmentTypes[i].categories.indexOf('communication');
					var ai = assessmentTypes[i].categories.indexOf('application');
					if(ki == -1)
					{
						$('#editKnowledgePercent').prop('disabled', true);
						$('#editKnowledgePercent').val('100');
					}
					else
					{
						$('#editKnowledgePercent').prop('disabled', false);
						$('#editKnowledgePercent').val(this.categoryPercentages[ki]);
					}
					if(ti == -1)
					{
						$('#editThinkingPercent').prop('disabled', true);
						$('#editThinkingPercent').val('100');
					}
					else
					{
						$('#editThinkingPercent').prop('disabled', false);
						$('#editThinkingPercent').val(this.categoryPercentages[ti]);
					}
					if(ci == -1)
					{
						$('#editCommunicationPercent').prop('disabled', true);
						$('#editCommunicationPercent').val('100');
					}
					else
					{
						$('#editCommunicationPercent').prop('disabled', false);
						$('#editCommunicationPercent').val(this.categoryPercentages[ci]);
					}
					if(ai == -1)
					{
						$('#editApplicationPercent').prop('disabled', true);
						$('#editApplicationPercent').val('100');
					}
					else
					{
						$('#editApplicationPercent').prop('disabled', false);
						$('#editApplicationPercent').val(this.categoryPercentages[ai]);
					}
					
					Session.set('editingAssessmentId', this);
					
					break;
				}
			}
		}

		, 'click .assessmentRemoveSymbol' : function(event)
		{
			Meteor.call("deleteAssessment", {assessmentId: this._id}, function(error)
			{
				if(error)
				{
					console.log(error);
					calculatePercentages(Router.current().data());
				}
			});
		}
	});
}

function calculatePercentages(t)
{
	// Segregating Assessment types with their respective categories
	var knowledgeAssessments = _.filter(t.classes.assessmentTypes, function(assessmentTypeObject){
		return (assessmentTypeObject.categories.indexOf("knowledge") != -1)
	})
	var knowledgeAssessmentWeights = [];
	var knowledgeAssessmentPercentages = [];

	_.each(knowledgeAssessments, function(assessmentTypeObject){
		var knowledgeIndex = assessmentTypeObject.categories.indexOf("knowledge");

		var assessments = Assessments.find({"parentClassId": t.classes._id, "authorId": Meteor.userId(), "type": assessmentTypeObject.typeName}).fetch();

		_.each(assessments, function(assessmentObject){
			knowledgeAssessmentWeights.push(assessmentTypeObject.weight);
			knowledgeAssessmentPercentages.push(assessmentObject.categoryPercentages[knowledgeIndex]);
		})
	})
	//###########
	var thinkingAssessments = _.filter(t.classes.assessmentTypes, function(assessmentTypeObject){
		return (assessmentTypeObject.categories.indexOf("thinking") != -1)
	})
	var thinkingAssessmentWeights = [];
	var thinkingAssessmentPercentages = [];

	_.each(thinkingAssessments, function(assessmentTypeObject){
		var thinkingIndex = assessmentTypeObject.categories.indexOf("thinking");

		var assessments = Assessments.find({"parentClassId": t.classes._id, "authorId": Meteor.userId(), "type": assessmentTypeObject.typeName}).fetch();
		
		_.each(assessments, function(assessmentObject){
			thinkingAssessmentWeights.push(assessmentTypeObject.weight);
			thinkingAssessmentPercentages.push(assessmentObject.categoryPercentages[thinkingIndex]);
		})
	})
	//###########
	var communicationAssessments = _.filter(t.classes.assessmentTypes, function(assessmentTypeObject){
		return (assessmentTypeObject.categories.indexOf("communication") != -1)
	})
	var communicationAssessmentWeights = [];
	var communicationAssessmentPercentages = [];

	_.each(communicationAssessments, function(assessmentTypeObject){
		var communicationIndex = assessmentTypeObject.categories.indexOf("communication");

		var assessments = Assessments.find({"parentClassId": t.classes._id, "authorId": Meteor.userId(), "type": assessmentTypeObject.typeName}).fetch();
		
		_.each(assessments, function(assessmentObject){
			communicationAssessmentWeights.push(assessmentTypeObject.weight);
			communicationAssessmentPercentages.push(assessmentObject.categoryPercentages[communicationIndex]);
		})
	})
	//###########
	var applicationAssessments = _.filter(t.classes.assessmentTypes, function(assessmentTypeObject){
		return (assessmentTypeObject.categories.indexOf("application") != -1)
	})
	var applicationAssessmentWeights = [];
	var applicationAssessmentPercentages = [];

	_.each(applicationAssessments, function(assessmentTypeObject){
		var applicationIndex = assessmentTypeObject.categories.indexOf("application");

		var assessments = Assessments.find({"parentClassId": t.classes._id, "authorId": Meteor.userId(), "type": assessmentTypeObject.typeName}).fetch();
		
		_.each(assessments, function(assessmentObject){
			applicationAssessmentWeights.push(assessmentTypeObject.weight);
			applicationAssessmentPercentages.push(assessmentObject.categoryPercentages[applicationIndex]);
		})
	})

// Calculating total weights for each category

	var totalKnowledgeWeight = 0,
		totalThinkingWeight = 0,
		totalCommunicationWeight = 0,
		totalApplicationWeight = 0;
	for(var x = 0; x < knowledgeAssessmentWeights.length; x++){
		totalKnowledgeWeight += knowledgeAssessmentWeights[x];
	}

	for(var x = 0; x < thinkingAssessmentWeights.length; x++){
		totalThinkingWeight += thinkingAssessmentWeights[x];
	}

	for(var x = 0; x < communicationAssessmentWeights.length; x++){
		totalCommunicationWeight += communicationAssessmentWeights[x];
	}

	for(var x = 0; x < applicationAssessmentWeights.length; x++){
		totalApplicationWeight += applicationAssessmentWeights[x];
	}

// Calculating weighted averages for every category
	var weightedKnowledgeAverage = 0,
		weightedThinkingAverage = 0,
		weightedCommunicationAverage = 0,
		weightedApplicationAverage = 0;

	for(var x = 0; x < knowledgeAssessmentPercentages.length; x++){
		weightedKnowledgeAverage += knowledgeAssessmentPercentages[x] * (knowledgeAssessmentWeights[x] / totalKnowledgeWeight);
	}

	for(var x = 0; x < thinkingAssessmentPercentages.length; x++){
		weightedThinkingAverage += thinkingAssessmentPercentages[x] * (thinkingAssessmentWeights[x] / totalThinkingWeight);
	}

	for(var x = 0; x < communicationAssessmentPercentages.length; x++){
		weightedCommunicationAverage += communicationAssessmentPercentages[x] * (communicationAssessmentWeights[x] / totalCommunicationWeight);
	}

	for(var x = 0; x < applicationAssessmentPercentages.length; x++){
		weightedApplicationAverage += applicationAssessmentPercentages[x] * (applicationAssessmentWeights[x] / totalApplicationWeight);
	}
	
// Calculating total average	

	var totalAverage = (weightedKnowledgeAverage * t.classes.categoryWeightings[0] / 100 + weightedThinkingAverage * t.classes.categoryWeightings[1] / 100 + weightedCommunicationAverage * t.classes.categoryWeightings[3] / 100 + weightedApplicationAverage * t.classes.categoryWeightings[2] / 100);
	var canvas = $('#percentage');
	if(canvas && canvas[0])
	{
		generatePercentageCircle(canvas[0], 190, 130, totalAverage/100, 'rgb(154,205,50)', 'rgb(119,157,38)', 5, '#FAF0CA');
	}
}

function generatePercentageCircle(canvas, radius, clearRadius, percentage, colour, border, borderWidth, textColour)
{
	var c = canvas.getContext('2d');
	c.clearRect(0, 0, canvas.width, canvas.height);
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
