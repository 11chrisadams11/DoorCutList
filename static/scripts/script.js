$(function() {

    var doorInputCount = 0,
        drawerInputCount = 0,
        optionOpen = false,
        doorList = [],
        drawerList = [],
        railList = [],
        stileList = [],
        panelList = [],
        doorCutList = [],
        drawerCutList = [],
        saveVisible = false;

    var cl = console.log;

    function getLists(){
        doorList = [];
        drawerList = [];
        $('div#input').children('div').each((e) => {
            var $thisDiv = $('div#input div:nth-child(' + (e + 1) +')');
            if (($thisDiv.find('.dWidth').val() !== '') && ($thisDiv.find('.dHeight').val() !== '') && ($thisDiv.find('.dQuantity').val() !== '')) {
                if ($thisDiv.attr('class') === 'door') {
                    doorList.push([parseFloat($thisDiv.find('.dWidth').val()),
                        parseFloat($thisDiv.find('.dHeight').val()),
                        parseInt($thisDiv.find('.dQuantity').val()),
                        $thisDiv.find('.dComment').val(),
                        $thisDiv.find('.dDoublePanel').is(':checked'),
                        $thisDiv.find('.dSash').is(':checked')])
                } else {
                    drawerList.push([parseFloat($thisDiv.find('.dWidth').val()),
                        parseFloat($thisDiv.find('.dHeight').val()),
                        parseInt($thisDiv.find('.dQuantity').val()),
                        $thisDiv.find('.dComment').val()])
                }
            }
        });
    }

    /**
     * Function that takes a number and searches a new array for supplied parameters.
     * Either adds to existing or appends new.
     * For panel and door lists.
     *
     * @param e float Number to be added to array
     * @param newList array Name of array to be added to
     * @param what array List of parameters to search for in new list
     */
    function addToList(e, newList, what){
        var found = false,
            whichOne = 0;
        newList.forEach((f, i) => {
            var count = 0;
            what.forEach((x) => {
                if(e[x] === f[x]){
                   count++
                }
            });
            if (count === what.length){
                found = true;
                whichOne = i
            }
        });

        if(e[4] && (e[3].toLowerCase().indexOf('dp') === -1) && (e[3].toLowerCase().indexOf('double panel') === -1)) {e[3] = (e[3] !== '') ? e[3] + ' DP' : 'DP';}
        if(e[5] && (e[3].toLowerCase().indexOf('sash') === -1)) {e[3] = (e[3] !== '') ? e[3] + ' Sash' : 'Sash';}

        if(found) {
            newList[whichOne][2] += e[2];
            if (newList[whichOne][3] === ''){
                newList[whichOne][3] = capitalize(e[3])
            } else {
                if(newList[whichOne][3].toLowerCase().indexOf(e[3].toLowerCase()) === -1){
                    newList[whichOne][3] += ' ' + capitalize(e[3])
                }
            }
        } else {
            e[3] = capitalize(e[3]);
            newList.push(e)
        }
    }

    function objToArray(obj){
        var newArr = [];
        for(var o in obj){
            if(obj.hasOwnProperty(o)){
                newArr.push([parseFloat(o), obj[o]])
            }
        }
        return newArr
    }

    function capitalize(string){
        if (/\s/g.test(string)) {
            var split = string.split(' '),
                newstring = '';
            split.forEach((e) => {
                newstring += e.charAt(0).toUpperCase() + e.slice(1) + ' '
            });
            return newstring
        } else {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    function fractions(what){
        if (Number.isInteger(what)) {
            return what
        } else {
            var split = what.toString().split('.'),
            f = new Fraction('.' + split[1]);
            return split[0] + ' <sup>' + f.n + '</sup>/<sub>' + f.d + '</sub>'
        }
    }

    var addInputs = (type, array) => {
        var add = '';
        if (type === 'door') {
            doorInputCount++;
            add = '<div class="door"><div class="label">Door</div><input type="text" class="dWidth"><input type="text" class="dHeight">' +
                '<input type="text" class="dQuantity"><input type="text" class="dComment"><input type="checkbox" class="dDoublePanel"><input type="checkbox" class="dSash"></div>';
        } else {
            drawerInputCount++;
            add = '<div class="drawer"><div class="label">Drawer</div><input type="text" class="dWidth"><input type="text" class="dHeight">' +
                '<input type="text" class="dQuantity"><input type="text" class="dComment"></div>';
        }

        $('#input').append(add);

        if(typeof array !== 'undefined' && array.length > 0 && type === 'door'){
            $('div#input .door:last-child .dWidth').val(array[0]);
            $('div#input .door:last-child .dHeight').val(array[1]);
            $('div#input .door:last-child .dQuantity').val(array[2]);
            $('div#input .door:last-child .dComment').val(array[3].replace('DP', '').replace('Sash', ''));
            $('div#input .door:last-child .dDoublePanel').prop('checked', array[4]);
            $('div#input .door:last-child .dSash').prop('checked', array[5]);
        } else if (typeof array !== 'undefined' && array.length > 0 && type === 'drawer'){
            $('div#input .drawer:last-child .dWidth').val(array[0]);
            $('div#input .drawer:last-child .dHeight').val(array[1]);
            $('div#input .drawer:last-child .dQuantity').val(array[2]);
            $('div#input .drawer:last-child .dComment').val(array[3]);
        }

        if (type === 'door') {
            $('div#input .door:last-child').fadeTo(200, 1)
        } else {
            $('div#input .drawer:last-child').fadeTo(200, 1)
        }

    };

    $('#saveButton').click(() => {
        getLists();
        var save = {
           customer: $('#customerNameInput').val(),
           doorStyle: $('input:radio[name="style"]:checked').val(),
           railWidth: parseFloat($('#railWidthInput').val()),
           stileWidth: parseFloat($('#stileWidthInput').val()),
           doors: doorList,
           drawers: drawerList
        };

        var filename = (save.customer === '') ? 'door cut list': save.customer;
        var blob = new Blob([JSON.stringify(save)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename+".dcl");
    });

    $('#openButton').change(() => {
        $('#input *').remove();
        doorInputCount = 0;
        drawerInputCount = 0;
        var file = $('#openButton')[0].files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            var data = JSON.parse(e.target.result);
            $('#customerNameInput').val(data.customer);
            $('#railWidthInput').val(data.railWidth);
            $('#stileWidthInput').val(data.stileWidth);
            switch(data.doorStyle){
                case 'Raised Panel':
                    $('#raisedPanelRadio').prop('checked', true);
                    break;
                case 'Shaker':
                    $('#shakerRadio').prop('checked', true);
                    break;
                case 'Bead Flat Panel':
                    $('#beadPanelRadio').prop('checked', true);
                    break;
            }
            data.doors.forEach((e) => {
                addInputs('door', e)
            });
            data.drawers.forEach((e) => {
                addInputs('drawer', e)
            })
        };

        $('#saveButton').fadeTo(400, 1);
    });

    $('#doorOptionsButton, #optionsSaveButton').click(() => {
        var num = (optionOpen) ? -88 : 60;
       $('#optionsContainer').animate({'top': num});
        optionOpen = !optionOpen
    });

    $('#printButton').click(() => {
        var stileWidth = parseFloat($('#stileWidthInput').val()),
            railWidth = parseFloat($('#railWidthInput').val()),
            panelQuantity = 1,
            stileCounter = 0,
            railCounter = 0,
            doorCounter = 0,
            drawerCounter = 0;
        doorList = [];
        drawerList = [];
        stileList = {};
        railList = {};
        panelList = [];
        doorCutList = [];
        drawerCutList = [];

        getLists();

        var shaperCut = ($('#shakerRadio').is(':checked')) ? 0.375 : 0.5;

        doorList.forEach((e) => {
            var stileSize = (Math.round((e[1] + 0.5) * 2) / 2),
                railSize = (e[0] - ((stileWidth * 2) - (shaperCut * 2))),
                panelWidth = 0,
                panelHeight = 0;

            if (!(stileList.hasOwnProperty(stileSize))) {
                stileList[stileSize] = (e[2] * 2)
            } else {
                stileList[stileSize] += (e[2] * 2)
            }

            var howManyRails = (e[4]) ? 3 : 2;
            if (!(railList.hasOwnProperty(railSize))) {
                railList[railSize] = (e[2] * howManyRails)
            } else {
                railList[railSize] += (e[2] * howManyRails)
            }

            var raisedPanelRadioChecked = $('#raisedPanelRadio').is(':checked');
            if(!e[5]) {
                var panelWMinus = (raisedPanelRadioChecked) ? 0.25 : 0.125;
                panelWidth = (e[0] - ((stileWidth * 2) - (shaperCut * 2))) - panelWMinus;
                if (e[4]) {
                    panelQuantity = 2;
                    if (shaperCut === 0.5) {
                        panelHeight = ((e[1] - ((railWidth * 3) - (shaperCut * 4))) - 0.125) / 2
                    } else {
                        panelHeight = (((e[1] - ((railWidth * 3) - (shaperCut * 4)))) / 2) + 0.0625
                    }
                } else {
                    panelQuantity = 1;
                    if (raisedPanelRadioChecked) {
                        panelHeight = (e[1] - ((railWidth * 2) - (shaperCut * 2))) - 0.125
                    } else if ($('#beadPanelRadio').is(':checked')) {
                        panelHeight = (e[1] - ((railWidth * 2) - (0.5 * 2))) + 0.0625
                    } else {
                        panelHeight = (e[1] - ((railWidth * 2) - (shaperCut * 2))) + 0.0625
                    }
                }

                var panelSize = [panelWidth, panelHeight, (panelQuantity * e[2]), ''];
                addToList(panelSize, panelList, [0, 1]);
            }

            addToList(e, doorCutList, [0, 1, 4, 5]);
        });

        drawerList.forEach((e) => {
            addToList(e, drawerCutList, [0, 1, 4, 5]);
        });

        stileList = objToArray(stileList);
        stileList.sort(firstBy(function(b1, b2) {return b1[0] - b2[0]}, -1));
        railList = objToArray(railList);
        railList.sort(firstBy(function(b1, b2) {return b1[0] - b2[0]}, -1));
        panelList.sort(firstBy(function(v1, v2) {return v1[1] - v2[1]}, -1).thenBy(function(b1, b2) {return b1[0] - b2[0]}, -1));
        doorCutList.sort(firstBy(function(v1, v2) {return v1[1] - v2[1]}, -1).thenBy(function(b1, b2) {return b1[0] - b2[0]}, -1));
        drawerCutList.sort(firstBy(function(b1, b2) {return b1[0] - b2[0]} , -1).thenBy(function(v1, v2) {return v1[1] - v2[1]}, -1));

        $('#printCustomerName').html(capitalize($('#customerNameInput').val()) + ' Door Cut List');
        var date = new Date;
        $('#printDate').html((date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear());
        $('#printDoorStyle').html('Door Style: ' + $('input:radio[name="style"]:checked').val());

        $('.listItem').remove();

        railList.forEach((e) => {
            railCounter += e[0] * e[1];
            $('#printRailList').append('<p class="listItem">' + fractions(e[0]) + ' <span class="quant">- ' + e[1] + '</span></p>' )
        });
        $('div#printRailListHeader p').html(fractions(railWidth) + '" - ' + Math.round((railCounter * 1.10) / 12) + "'");

        stileList.forEach((e) => {
            stileCounter += e[0] * e[1];
            $('#printStileList').append('<p class="listItem">' + fractions(e[0]) + ' <span class="quant">- ' + e[1] + '</span></p>' )
        });
        $('div#printStileListHeader p').html(fractions(stileWidth) + '" - ' + Math.round((stileCounter * 1.10) / 12) + "'");

        panelList.forEach((e) => {
            $('#printPanelList').append('<p class="listItem"></p>');
            $('div#printPanelList p:last-child').html('<div class="pWidth">' + fractions(e[0]) + '</div><div class="x">x</div><div class="pHeight">' + fractions(e[1]) + '</div><span class="quant">- ' + e[2] + '</span>').appendTo('#printPanelList')
        });

        doorCutList.forEach((e) => {
            doorCounter += e[2];
            $('#printDoorList').append('<p class="listItem"></p>');
            var $lastP = $('div#printDoorList  .listItem:last-child');
            $lastP.html('<div class="pWidth">' + fractions(e[0]) + '</div><div class="x">x</div><div class="pHeight">' + fractions(e[1]) + '</div><div class="dQuant">- ' + e[2] + '</div><div class="comment">' + e[3] + '</div>');

            while($lastP.outerWidth() > 381) {

                var oldSize = parseInt($lastP.find('.comment').css('font-size').replace('px', ''));
                oldSize--;
                $lastP.find('.comment').css({'font-size': oldSize})
            }
        });
        $('div#printDoorListHeader span').html(doorCounter);

        drawerCutList.forEach((e) => {
            drawerCounter += e[2];
            $('#printDrawerList').append('<p class="listItem"></p>');
            $('div#printDrawerList p:last-child').append('<div class="pWidth">' + fractions(e[0]) + '</div><div class="x">x</div><div class="pHeight">' + fractions(e[1]) + '</div><div class="dQuant">- ' + e[2] + '</div><div class="comment">' + e[3] + '</div>')
        });
        if (drawerCounter > 0){
            $('#printDrawerList').show();
            $('div#printDrawerListHeader span').html(drawerCounter);
        } else {
            $('#printDrawerList').hide()
        }

        /*$('#printContainer').fadeIn()*/
        window.scrollTo(0, 0);
        $('#printFade').fadeIn();
        $('#printContainer').animate({'top': 5})
    });

    $('#addDoorButton').click(function(){
        var $lastDoor = $('div#input .door').last(),
            widthEmpty = $lastDoor.find('.dWidth'),
            heightEmpty = $lastDoor.find('.dHeight'),
            quantityEmpty = $lastDoor.find('.dQuantity'),
            anyEmpty = 0;

        [widthEmpty, heightEmpty, quantityEmpty].forEach((e) => {
            if(e.val() === '' || isNaN(e.val())){
                anyEmpty++;
                e.css({'background-color': '#FFD6BC'})
            } else {
                e.css({'background-color': 'white'})
            }
        });

        if (anyEmpty === 0 || doorInputCount === 0){
            addInputs('door');
            $('div#input div:last-child .dWidth').focus()
        }

        if (!saveVisible) {
            $('#saveButton').fadeTo(400, 1);
            saveVisible = true
        }
    });

    $('#addDrawerButton').click(() => {
        var $lastDrawer = $('div#input .drawer').last(),
            widthEmpty = $lastDrawer.find('.dWidth'),
            heightEmpty = $lastDrawer.find('.dHeight'),
            quantityEmpty = $lastDrawer.find('.dQuantity'),
            anyEmpty = 0;

        [widthEmpty, heightEmpty, quantityEmpty].forEach((e) => {
            if(e.val() === '' || isNaN(e.val())){
                anyEmpty++;
                e.css({'background-color': '#FFD6BC'})
            } else {
                e.css({'background-color': 'white'})
            }
        });

        if (anyEmpty === 0 || drawerInputCount === 0){
            addInputs('drawer');
            $('div#input div:last-child .dWidth').focus()
        }

        if (!saveVisible) {
            $('#saveButton').fadeTo(400, 1);
            saveVisible = true
        }
    });

    $('div#input').on('keypress', 'input', function(e){
        if(e.which === 13) {
            if($(this).parent().attr('class') === 'door'){
                $('#addDoorButton').click()
            } else {
                $('#addDrawerButton').click()
            }
        }
    })
    .on('input', 'input', function(){
        if ($(this).val() === '') {
            $(this).css({'background-color': '#FFD6BC'})
        } else {
            $(this).css({'background-color': 'white'})
        }
    });

    $('#printPrintButton').click(() => {
        var $printCommentsTextarea = $('#printCommentsTextarea'),
            $hidden = $('#printPrintButton, #closeButton'),
            $printComments = $('#printComments');

        if($printCommentsTextarea.html() === ''){
            $printComments.hide()
        } else {
            $printCommentsTextarea.css({'border-width': 0})
        }
        $hidden.hide();

        window.print();

        $hidden.fadeIn();
        $printComments.fadeIn();
        $printCommentsTextarea.css({'border-width': 1})
    });

    $('#closeButton').click(() => {
        $('#printContainer').animate({'top': -($(this).outerHeight() + 10)});
        $('#printFade').fadeOut()
    });

    $('#input').on('click', '.label', function(e){
        $(this).parent().append('<div class="delete">Delete Row<div class="deleteYes deleteButton">Yes</div><div class="deleteCancel deleteButton">Cancel</div></div>').find('.delete').fadeTo(200, 1)
    })
    .on('click', '.deleteCancel', function(){
        $(this).parent().fadeTo(200, 0, function(){
            $(this).remove()
        })
    })
    .on('click', '.deleteYes', function(){
        if($(this).parent().parent().find('.label').text() === 'Door'){
            doorInputCount--;
        } else {
            drawerInputCount--;
        }
        /*$(this).parent().parent().fadeTo(400, 0, function(){
            $(this).remove()
        })*/
        $(this).parent().parent().animate({height: 0}, function(){
            $(this).remove()
        })
    });

});