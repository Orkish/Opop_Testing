var opoplib = {

    /*
    * item-1  :  preCheckOptIn(opt)
    * item-2  :  changeShare(appName, toShare, shareText, subject)
    * item-3  :  clearSignUp()
    * item-4  :  hideRequired(name, fill)
    * item-5  :  reorderForm(order)
    * item-6  :  wordCount(field, wordCount, stringText)
    * item-7  :  charCount(field, charCount, stringText)
    * item-8  :  removeOr()
    */

    //======================item-1
    //Pre-check opt in boxes
    preCheckOptIn : function(opt) {
        $('#' + opt).prop('checked', true);
    }

    //==============================================item-2
    //Change Share Copy for sign up or photo contest
    ,changeShare : function(appName, toShare, shareText, subject) {
            var text = encodeURIComponent(shareText)
                ,subject = encodeURIComponent(subject)
                ,pcBitly = encodeURIComponent($('.bitlyLink').val())
                ,suBitly = encodeURIComponent($('#share-url').val());

            if (toShare === 'twitter') {
                var rawLink = 'http://twitter.com/share?text=' + text + '&url=';

                if (appName === 'sign up') {
                    var twitterLink = rawLink + suBitly;
                } else if (appName === 'photo contest') {
                    var twitterLink = rawLink + pcBitly;
                }

                $('#share-option-twitter a').attr('href', twitterLink);

            } else if (toShare === 'email') {
                var rawLink = 'mailto:?subject=' + subject + '&body=' + text + '%20';

                if (appName === 'sign up') {
                    var emailLink = rawLink + suBitly;
                } else if (appName === 'photo contest') {
                    var emailLink = rawLink + pcBitly;
                }

                $('#share-option-email a').attr('href', emailLink);

            } else if (toShare === 'pinterest'){
                var pinterestAnchor = '#share-option-pinterest a'
                    ,pinterestHref = $(pinterestAnchor).attr('href')
                    ,sLink = pinterestHref.indexOf('url=') + 4
                    ,eLink = pinterestHref.indexOf('&media')
                    ,aLink = pinterestHref.slice(sLink, eLink)
                    ,media = $('#media-photo').attr('src')
                    ,pinterestLink = 'http://pinterest.com/pin/create/button/?media=' + media + '&description=' + text + '&url=' + aLink;
                    
                $(pinterestAnchor).attr('href', pinterestLink);            

            }
    }

    //==============================================item-3
    //Clear all of Sign up content to make blank app
    ,clearSignUp : function() {
        $('head').append('<link rel="stylesheet" href="https://s3.amazonaws.com/assets.offerpop.com/js_functions/clearSignUp.css" type="text/css" />');
    }

    //==============================================item-4
    //Hide and pre-populate required form fields
    ,hideRequired : function(name, fill) {

        var lowerName = name.toLowerCase();

        $('div.SField input, div.SField textarea, .submit-field input, .submit-field textarea').each(function(){
            var id = $(this).attr('id');

            if(id === lowerName) {
                $(this).attr('value', fill);
                $('#sfield_' + id).hide();
            }

        });

        if (lowerName === 'city') {
                $('.gallery-photo-city, .CLocation').hide();
            }

        if (lowerName === 'caption') {
            $('div.CQuote, .ui-li-heading').hide();
        }

        if (lowerName === 'firstname' || name === 'first name') {
            $('.gallery-photo-firstname, div.CName').hide();
        }
    }

    //==============================================item-5
    //Reorder input fields on the sign up form. Must use comma seperated string as the parameter
    ,reorderForm : function(order) {

        var lower = order.toLowerCase();
        var arr = lower.split(', ');

        for (var i = 0; i < arr.length; i++) {
            var after = i - 1;
            $('#sfield_' + arr[i]).addClass('order' + i);
            $('#sfield_' + arr[i]).insertAfter('.order' + after);
        }

    }

    //==============================================item-6
    //Add word count to submit form, takes "field name" and "max word count" as parameters
    //stringText is "Words Left: " by default
    ,wordCount : function(field, wordCount, stringText){ //stringText is optional
        var remainString = stringText + ': ';
        if (stringText === undefined){
            remainString = 'Words Left: ';
        }

        $('<p id="pp">' + remainString + '<span>'+ wordCount + '</span></p>').appendTo('#sfield_' + field);
        var textColor = $('#pp').css('color');

        var validateWordCount = function(){
            var textValue = $('#' + field).val().toString().split(" ")
                ,maxCount = wordCount
                ,textBoxLength = textValue.length
                ,wordsLeft = maxCount - textBoxLength;
                
            $('#pp span').text(wordsLeft);
                if (wordsLeft < 0) {
                    $('#pp').css('color','red');
                }else{
                    $('#pp').css('color', textColor );
                }
            if (textValue[0] === ''){$('#pp span').text(maxCount);}
            return wordsLeft;
        }

            //Validate on Key up
            $('#' + field).keyup(function() {
                validateWordCount();
            });

                //Don't allow user to press "enter"
                $('#' + field).keypress(function(event) {
                    if(event.which == '13') {
                      return false;
                    }
                });

        //DESKTOP & MOBILE event handler
        $('#form_submit_button, #form-submit-button').click(function(){
            var wordsLeft = validateWordCount();            
            if (wordsLeft < 0){
                alert("Please check your word count");
                return false;
            }
        });
    }

    //========================================item-7
    //Character count validation
    //stringText is "Characters Left: " by default
    ,charCount : function(field, charCount, stringText){ //stringText is optional
        var remainString = stringText + ': ';        
        if (stringText === undefined){
            remainString = 'Characters left: ';
        }

        $('<p id="numCount">' + remainString + charCount + '</p>').appendTo('#sfield_' + field);
            
            var validateCharCount = function(e){
                var tval = $('#' + field).val()
                    ,tlength = tval.length
                    ,set = charCount
                    ,remain = set - tlength;
                    $('p#numCount').text(remainString + remain);
                    
                    if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
                        $('#' + field).val((tval).substring(0, tlength - 1))
                    }
            }

                $('#' + field).keypress(function(e) {
                    if(e.which == '13') {
                        return false;
                    } else{
                        var scope = e;
                        validateCharCount(scope);
                    }
                });

                    $('#' + field).keyup(function(e){
                        if(e.which == '8'){
                            validateCharCount();
                        }   
                    });
    }
    
    //========================================item-8
    //Remove -OR- in photo/video contest in .CFile
    ,removeOr : function(){
        $(".CFile").contents().filter(function(){ return this.nodeType == 3; }).remove();
    }

// Bracket below ends the library. Must be after last function
}

// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

/* Things to add */
/*****************
- Clear Pop Share
- Prepopulated text fields

*/