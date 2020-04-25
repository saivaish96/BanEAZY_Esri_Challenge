noOfRecordsPerPage = 10
 AOS.init({
 	duration: 800,
 	easing: 'slide',
 	once: true
 });

jQuery(document).ready(function($) {

	"use strict";

	
	$(".loader").delay(1000).fadeOut("slow");
  $("#overlayer").delay(1000).fadeOut("slow");	
  

	var siteMenuClone = function() {

		$('.js-clone-nav').each(function() {
			var $this = $(this);
			$this.clone().attr('class', 'site-nav-wrap').appendTo('.site-mobile-menu-body');
		});


		setTimeout(function() {

			var counter = 0;
      $('.site-mobile-menu .has-children').each(function(){
        var $this = $(this);

        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find('.arrow-collapse').attr({
          'data-toggle' : 'collapse',
          'data-target' : '#collapseItem' + counter,
        });

        $this.find('> ul').attr({
          'class' : 'collapse',
          'id' : 'collapseItem' + counter,
        });

        counter++;

      });

    }, 1000);

		$('body').on('click', '.arrow-collapse', function(e) {
      var $this = $(this);
      if ( $this.closest('li').find('.collapse').hasClass('show') ) {
        $this.removeClass('active');
      } else {
        $this.addClass('active');
      }
      e.preventDefault();

    });

		$(window).resize(function() {
			var $this = $(this),
				w = $this.width();

			if ( w > 768 ) {
				if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
			}
		})

		$('body').on('click', '.js-menu-toggle', function(e) {
			var $this = $(this);
			e.preventDefault();

			if ( $('body').hasClass('offcanvas-menu') ) {
				$('body').removeClass('offcanvas-menu');
				$this.removeClass('active');
			} else {
				$('body').addClass('offcanvas-menu');
				$this.addClass('active');
			}
		})

		// click outisde offcanvas
		$(document).mouseup(function(e) {
	    var container = $(".site-mobile-menu");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {
	      if ( $('body').hasClass('offcanvas-menu') ) {
					$('body').removeClass('offcanvas-menu');
				}
	    }
		});
	};
	siteMenuClone();

	var siteSticky = function() {
		$(".js-sticky-header").sticky({topSpacing:0});
	};
	siteSticky();

	// navigation
  var OnePageNavigation = function() {
    var navToggler = $('.site-menu-toggle');
   	$("body").on("click", ".main-menu li a[href^='#'], .smoothscroll[href^='#'], .site-mobile-menu .site-nav-wrap li a", function(e) {
      e.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        'scrollTop': $(hash).offset().top
      }, 600, 'easeInOutExpo', function(){
        window.location.hash = hash;
      });

    });
  };
  OnePageNavigation();

  var siteScroll = function() {

  	

  	$(window).scroll(function() {

  		var st = $(this).scrollTop();

  		if (st > 100) {
  			$('.js-sticky-header').addClass('shrink');
  		} else {
  			$('.js-sticky-header').removeClass('shrink');
  		}

  	}) 

  };
  siteScroll();
  getDataFromAPI(pagination);
  getDataFromAPI(createDictForDeposit)
  getDataFromAPI(createDictForWithdraw)

$(".pagination").delegate("a", "click", function (event){
   $(this).siblings().removeClass('active');
   $(this).addClass('active');
   getDataFromAPI(populateRecords, event.target.id);
});
});
function createDOM(values){
var rootTr = document.createElement("tr");
var accountNo = document.createElement("td");
accountNo.innerHTML = values[0];
var date = document.createElement("td");
date.innerHTML = values[1];
var transac = document.createElement("td");
transac.innerHTML = values[2];
var value = document.createElement("td");
value.innerHTML = values[3];
var withdraw = document.createElement("td");
withdraw.innerHTML = values[4];
var deposit = document.createElement("td");
deposit.innerHTML = values[5];
var balance = document.createElement("td");
balance.innerHTML = values[6];
rootTr.appendChild(accountNo);
rootTr.appendChild(date);
rootTr.appendChild(transac);
rootTr.appendChild(value);
rootTr.appendChild(withdraw);
rootTr.appendChild(deposit);
rootTr.appendChild(balance);
$("#tableBody").append(rootTr);
}

function getDataFromAPI(callback, passData){
$.ajax({
    url: 'http://starlord.hackerearth.com/bankAccount',
    type: "GET",
    dataType: "json",
    data: {
    },
    success: function(data) {
             callback(data, passData)
         },
    error: function () {
        console.log("error");
    }
});
}

function pagination(data,passData){
total = data.length;
noOfPages = Math.ceil(total/noOfRecordsPerPage);
for(i=1; i<=noOfPages;i++){
var a = document.createElement("a");
a.setAttribute("id", i);
a.setAttribute("href","#services-section")
a.innerHTML = i;
if (i==1)
{
a.className = "active paginate"
}
else{
a.className = "paginate"
}
$(".paginate").css("cursor", "pointer");
$(".pagination").append(a);
}
//populate records in first page
for (var i = findMin(1); i < (findMin(1) + noOfRecordsPerPage); i++) {
    values = Object.values(data[i]);
    createDOM(values);
}
}

function findMin(page){
min = (page - 1) * noOfRecordsPerPage;
return min
}

function populateRecords(data, id){
   $("#tableBody").empty();
   for (var i = findMin(parseInt(id)); i < (findMin(parseInt(id)) + noOfRecordsPerPage); i++) {
    if (data[i] != undefined)
    {
    values = Object.values(data[i]);
    createDOM(values);
    }
}
}

function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("accountTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function createDictForDeposit(result){
var dict = [];
$.each(result, function(index, value) {
if (value["Transaction Details"] in dict) {
deposit = dict[value["Transaction Details"]] + Number(value["Deposit AMT"].replace(/[^0-9\.]+/g,""));
}
else{
deposit = Number(value["Deposit AMT"].replace(/[^0-9\.]+/g,""));
}
dict[value["Transaction Details"]] = deposit;
});
createDataPoints(dict, "Transaction recipients in 2017 based on Deposit Amt", "chartContainer");
}

function createDictForWithdraw(result){
var dict = [];
$.each(result, function(index, value) {
if (value["Transaction Details"] in dict) {
withdraw = dict[value["Transaction Details"]] + Number(value["Withdrawal AMT"].replace(/[^0-9\.]+/g,""));
}
else{
withdraw = Number(value["Withdrawal AMT"].replace(/[^0-9\.]+/g,""));
}
dict[value["Transaction Details"]] = withdraw;
});
createDataPoints(dict, "Transaction recipients in 2017 based on Withdrawal Amt","chartContainer1");
}

function createDataPoints(dict, text, chartId){
var dataPoints = [];
Object.entries(dict).forEach(function([key, value]) {
   var point = {};
   point["y"] = value;
   point["label"] = key;
   dataPoints.push(point);
   });
     var chart = new CanvasJS.Chart(chartId, {
	theme: "light1", // "light1", "light2", "dark1", "dark2"
	exportEnabled: false,
	animationEnabled: true,
	title: {
		text: text
	},
	data: [{
		type: "pie",
		startAngle: 25,
		toolTipContent: "<b>{label}</b>: {y}",
		indexLabelFontSize: 16,
		indexLabel: "{label} - {y}",
		dataPoints: dataPoints
	}]
});
  chart.render();
}