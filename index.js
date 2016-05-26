var newsfeed = new gfeedfetcher("feeds", "feeds");
newsfeed.setentrycontainer("li class='title'"); //Display each entry as a <li>
newsfeed.filterfeed(100, "date"); //Show maximum 100 entries, sort by date
var actualChannel;

$('.createChannel').click(function () {
    var labelInput = $('.channelLabel'),
        addrInput  = $('.channelAddr'),
        label      = labelInput.val(),
        addr       = addrInput.val(),
        channelIndex;

    if(label < 1 || addr < 1) {
        $('.channel-ctrl').addClass('has-warning');
        console.error('Blank input');
        return;
    } else {
        $('.channel-ctrl').removeClass('has-warning');
    }

    channelIndex = newsfeed.feedlabels.indexOf(label);

    // check if the channel with this label already exists
    if(channelIndex < 0 || !newsfeed.feedsfetched) {
        labelInput.val('');
        addrInput.val('');
        newsfeed.addFeed(label, addr);
        newsfeed.init();
        var channel = "<div class='channel'><p class='channelsListName'>" + label + "</p><div class='delete-channel'><i class='fa fa-trash-o'></i></div></div>";
        $('.channels').append($(channel));
        $('.channelsNumber').html(newsfeed.feedlabels.length);
        newsfeed.onfeedload = function() {
            setChannel(label);
        };
    } else {
        console.log('Channel already exists');
    }
});

function setChannel(label) {
    actualChannel = label;
    var feedNodes = $('.title'),
        feeds = newsfeed.feeds,
        hiddenFeeds = 0,
        authors = [],
        thisAuthor,
        labelFeed;

    for(var i = feedNodes.length-1; i >= 0; --i) {
        $(feedNodes[i]).show();
        labelFeed = feedNodes[i].children[0].children[0].innerText;
        if(labelFeed != label) {
            $(feedNodes[i]).hide();
            hiddenFeeds++;
        }
        if(feeds[i].ddlabel === label) {
            thisAuthor = feeds[i].author;
            if(authors.indexOf(thisAuthor) && thisAuthor) {
                authors.push(thisAuthor);
            }
        }
    }
    $('.messagesNumber').html(feedNodes.length - hiddenFeeds);
    $('.authorsNumber').html(authors.length);
}

function deleteChannel(channelName) {
    var channelIndex = newsfeed.feedlabels.indexOf(channelName),
        msgLabel;

    newsfeed.feedlabels.splice(channelIndex, 1);
    newsfeed.feedurls.splice(channelIndex, 1);
    // if no feeds are present -> clear the feeds container
    if(!newsfeed.feedlabels.length) {
        $('#feeds').empty();
        $('#canvas-holder').empty();
        $('.authorsNumber').html('0');
        $('.messagesNumber').html('0');
    } else if(actualChannel === channelName) {
        // change channel after delete of the actual one
        changeChannel(channelIndex);
    }
    // if user removed channel which message belongs to, then remove message too
    msgLabel = $('.messageContainer').attr('label');
    if(channelName === msgLabel) {
        $('.messageContainer').empty();
        $('.messageTitle').hide();
        $('#canvas-holder').empty();
        clearChartData();
    }
    $('.channelsNumber').html(newsfeed.feedlabels.length);
}

function changeChannel(channelIndex) {
    if(newsfeed.feedlabels[channelIndex]) {
        setChannel(newsfeed.feedlabels[channelIndex]);
    } else {
        setChannel(newsfeed.feedlabels[channelIndex - 1]);
    }
}

// detect which channel user wants to remove, then pass the name of it to delete function
$(document).on("click", '.delete-channel', function () {
    //event.stopPropagation();
    var channelName = $(this).parent()[0].children[0].innerText;
    $(this).parent().remove();
    deleteChannel(channelName);
    return false;
});

// detect which message user wants to look at, then display it and attach channel label to message
$(document).on('click', '.title', function () {
    var msgIndex = $(this).index(),
        msg      = newsfeed.feeds[msgIndex].content.replace(/(<([^>]+)>)/ig, '');

    if(msg) {
        $('.messageTitle').show();
        $('.messageContainer').html(msg);
        $('#canvas-holder').append('<canvas id="chart-area" />');
        paintChart(msg.countChars());
        $('.messageContainer').attr('label', newsfeed.feeds[msgIndex].ddlabel);
    } else {
        $('.messageContainer').html('No message provided');
    }
});

$(document).on('click', '.channel', function () {
    var label = $(this).children().context.innerText;
    label = label.replace(/[^a-zA-Z]/g, "");
    setChannel(label);
});