var timeline = function(config) {
    var self = this;

    self.git = new git(config);

    self.messages = [];

    self.options = {
        issue_total_num:0,
        issue_show_num:0,
        page:1,
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

    var message = function(issue_content, issue_id) {
        this.data = issue_content;
        this.id = issue_id;
    }

    message.prototype = {
        init: function() {
            this.data.created_at = self.utc2localTime(this.data.created_at);
            var content = '<li class="article-list-item scrollappear appear appeared">';
            if(this.data.labels[0] == 'document') {
                content += '<a class="article-title" href="' + this.data.html_url + '"><h3>' + this.data.labels[0] + '<svg xmlns="http://www.w3.org/2000/svg" class="icon-arrow-right"><use href="images/arrow-right.svg#icon-arrow-right" xlink:href="images/arrow-right.svg"></use></svg></h3></a>';
            }
            content += '<div class="gitment-markdown">' + this.data.body_html + '</div>';
            content += '<div class="article-list-footer"><span class="article-list-date">' + this.data.created_at + '</span><span class="article-list-divider">-</span><div class="article-list-tags"><a>' + this.data.labels[0].name + '</a></div></div></li>';
            document.getElementById('message-list').innerHTML += content;
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

    self.setTitle = function() {
        $('#title').text(config.title);
        document.getElementsByTagName("title")[0].innerText = config.title;
    }

    self.init = function() {
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