var timeline = function(config) {
    var self = this;

    self.git = new git(config);

    self.messages = [];

    self.icons = [];

    self.options = {
        issue_total_num:0,
        issue_show_num:0,
        page:1,
        icon_num:0
    }

    self.utc2localTime = function(time) {
        var time_string_utc_epoch = Date.parse(time);
        var unixTimestamp = new Date(time_string_utc_epoch);
        var year = unixTimestamp.getFullYear();
        var month = unixTimestamp.getMonth() + 1;
        var date = unixTimestamp.getDate();
        var hour = unixTimestamp.getHours();
        var minute = unixTimestamp.getMinutes();
        var second = unixTimestamp.getSeconds();
        hour = (hour<10)?'0'+hour:hour;
        minute = (minute<10)?'0'+minute:minute;
        second = (second<10)?'0'+second:second;
        return year+'年'+month+'月'+date+'日'+' '+hour+':'+minute+':'+second;
    }

    var Icon = function(options, name, left) {
        this.icon_src = options.icon_src;
        this.href = options.href;
        this.hidden_img = options.hidden_img;
        this.width = options.width;
        this.name = name;
        this.position = left;
    }

    Icon.prototype = {
        init: function() {
            var icon = this;
            if(icon.href != undefined && icon.href != null) {
                document.getElementById("div_"+icon.name).innerHTML += '<a target="_blank" title="' + icon.name + '" id="icon_' + icon.name + '" href="' + icon.href + '"><img src="' + icon.icon_src + '" style="width:' + icon.width + 'px;margin-left:10px;margin-right:10px"></a>';
            } else {
                document.getElementById("div_"+icon.name).innerHTML += '<img src="' + icon.icon_src + '" title="' + icon.name + '" id="icon_' + icon.name + '" style="width:' + icon.width + 'px;margin-left:10px;margin-right:10px;cursor:pointer">';
            }
        }
    }

    var message = function(issue_content, issue_id) {
        this.data = issue_content;
        this.id = issue_id;
    }

    message.prototype = {
        init: function() {
            this.data.created_at = self.utc2localTime(this.data.created_at);
            document.getElementById('message-list').innerHTML += '<li class="gitment-comment">' + '<a class="gitment-comment-avatar" href=' + this.data.user.html_url + ' target="_blank"><img class="gitment-comment-avatar-img" src=' + this.data.user.avatar_url + '></a><div class="gitment-comment-main"><div class="gitment-comment-header"><a class="gitment-comment-name" href=' + this.data.user.html_url + ' target="_blank">' + this.data.user.login + '</a></div><div class="gitment-comment-body gitment-markdown">' + this.data.body_html + '</div><div class="gitment-comment-header"><span>' + this.data.created_at + '</span></div></div></li>';
        }
    }

    self.getMessageTotalNum = function() {
        self.git.getIssueNum(function(data) {
            self.options.issue_total_num = data.open_issues_count;
            self.lazyLoad({
                author:config.name,
                page:self.options.page,
                per_page:10,
                type:'html'
            });
        });
    }

    self.lazyLoad = function(options) {
        if(self.options.issue_show_num == self.options.issue_total_num) {
            document.getElementById("load_message").innerHTML = "已经到底了~";
        } else {
            document.getElementById("load_message").innerHTML = "加载中……";
            self.git.getIssue(options, function(data) {
                for(var i in data) {
                    var temp_message = new message(data[i], i+1);
                    temp_message.init();
                    self.options.issue_show_num++;
                    self.messages.push(temp_message);
                    document.getElementById("load_message").innerHTML = "";
                }
                self.options.page++;
            });
        }
    }

    self.showIcon = function() {
        for (var i in config.icons) {
            if (config.icons[i].icon_src != undefined && config.icons[i].icon_src != null) {
                document.getElementById('icon').innerHTML += '<div style="padding-inline-start: 0;margin: 0" id="div_'+i+'"></div>';
            }
        }
        for (var i in config.icons) {
            if (config.icons[i].icon_src != undefined && config.icons[i].icon_src != null) {
                var left = Object.keys(config.icons).length * 35 - 70 * self.options.icon_num + config.icons[i].width / 2 - 35;
                var icon = new Icon(config.icons[i], i, left);
                icon.init();
                self.icons.push(icon);
                self.options.icon_num++;
            }
        }
    }

    self.setTitle = function() {
        $('#title').text(config.title);
        document.getElementsByTagName("title")[0].innerText = config.title;
    }

    self.init = function() {
        self.showIcon();
        self.getMessageTotalNum();
        self.setTitle();
        window.onscroll = function() {
            if($(document).height() == $(window).height() + $(window).scrollTop()) {
                self.lazyLoad({
                    author:config.name,
                    page:self.options.page,
                    per_page:10,
                    type:'html'
                });
            }
        }
    }
}

$.ajax({
    type: 'get',
    headers: {
        Accept: 'application/json',
    },
    url: 'config.json',
    success: function(data) {
        new timeline(data).init();
    }
});