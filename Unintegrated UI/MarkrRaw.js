if (Meteor.isClient) {
  
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

  Template.mainContent.helpers({
    classList: function()
    {
      return [{className: "ICS 4U1 - 01"}, {className: "HZT 4U1 - 01"}, {className: "MFU 4U1 - 01"}];
    }
  });
  
  Template.mainContent.rendered = function()
  {
    var percentageCanvas = $('#percentage');
    generatePercentageCircle(percentageCanvas[0], 190, 130, .93, 'rgb(154,205,50)', 'rgb(119,157,38)', 5, '#FAF0CA');
  };
  
  Template.mainContent.helpers({
    assessmentList: function()
    {
      return [{assessmentName: "Test #1", assessmentDate: "January 14, 2016"}, {assessmentName: "Test #2", assessmentDate: "January 15, 2016"}];
    }
  });

  Template.assessment.helpers({
    assessmentKMark: function()
    {
      //return assessmentMark[0] / assessmentCategoryDenominators[0];
      return .97;
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
