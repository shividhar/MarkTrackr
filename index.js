if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  
  Template.body.helpers({
	  classList: function()
	  {
		  return [{className: "ICS 4U1 - 01"}, {className: "HZT 4U1 - 01"}, {className: "MFU 4U1 - 01"}];
	  }
  });
  
  Template.mainContent.rendered = function()
  {
	  var percentageCanvas = $('#percentage');
	  console.log(percentageCanvas);
	  generatePercentageCircle(percentageCanvas[0], 190, 130, .93, 'rgb(154,205,50)', 'rgb(119,157,38)', 5);
  };
  
  Template.mainContent.helpers({
	  assessmentList: function()
	  {
		  return [{assessmentName: "Test #1", assessmentDate: "January 14, 2016"}, {assessmentName: "Test #2", assessmentDate: "January 15, 2016"}];
	  }
  });

  Template.mainContent.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}


function generatePercentageCircle(canvas, radius, clearRadius, percentage, colour, border, borderWidth)
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
