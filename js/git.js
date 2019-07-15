var git = function(config) {
    var self = this;

    self.options = {
        name:'null',
        repo:'null',
        client_id:'null',
        client_secret:'null',
        server_link:'null'
    }

    self.set = function (options) {
		for (var i in options) {
			if (self.options[i] != undefined) {
				self.options[i] = options[i];
			}
		}
    }
    
    self.set(config);

    self.getIssue = function(options, callback) {
        var creator,page,per_page,id,requst_url;
        if(options.author == null || options.author == undefined) {
            creator = self.options.name;
        } else {
            creator = options.author;
        }
        if(options.page == null || options.page == undefined) {
            page = 1;
        } else {
            page = options.page;
        }

        if(options.per_page == null || options.per_page == undefined) {
            per_page = 10;
        } else {
            per_page = options.per_page;
        }

        if(options.issue_id == null || options.issue_id == undefined) {
            id = null;
        } else {
            id = options.issue_id;
        }

        if(id == null) {
            requst_url = 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues?creator=' + creator + '&' + 'page=' + page + '&per_page=' + per_page;
        } else {
            requst_url = 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues/' + id;
        }

        if(options.type == 'markdown' || options.type == null || options.type == undefined) {
            $.ajax({
                type: 'get',
                url: requst_url,
                success: function(data) {
                    callback(data);
                }
            });
        } else if(options.type == 'html') {
            $.ajax({
                type: 'get',
                headers: {
                    Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
                },
                url: requst_url,
                success: function(data) {
                    callback(data);
                }
            });
        }
    }

    self.getIssueNum = function(callback) {
        $.ajax({
            type: 'get',
            url: 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo,
            success: function(data) {
                callback(data);
            }
        });
    }

    self.getComment = function(options, callback) {
        var page,per_page,issue_id;
        if(options.issue_id == null || options.issue_id == undefined) {
            return;
        } else {
            issue_id = options.issue_id;
        }
        if(options.page == null || options.page == undefined) {
            page = 1;
        } else {
            page = options.page;
        }

        if(options.per_page == null || options.per_page == undefined) {
            per_page = 10;
        } else {
            per_page = options.per_page;
        }

        if(options.type == 'markdown' || options.type == null || options.type == undefined) {
            $.ajax({
                type: 'get',
                url: 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues/' + issue_id + '/comments?page=' + page + '&per_page=' + per_page,
                success: function(data) {
                    callback(data);
                }
            });
        } else if(options.type == 'html') {
            $.ajax({
                type: 'get',
                headers: {
                    Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json, application/x-www-form-urlencoded',
                },
                url: 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues/' + issue_id + '/comments?page=' + page + '&per_page=' + per_page,
                success: function(data) {
                    callback(data);
                }
            });
        }
    }

    self.createComment = function(options, callback) {
        var token,id;
        if(options.token == null || options.token == undefined) {
            return;
        } else {
            token = options.token;
        }

        if(options.issue_id == null || options.issue_id == undefined) {
            return;
        } else {
            id = options.issue_id;
        }

        $.ajax({
            type: "post",
            url: 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues/' + id + '/comments',
            headers: {
                Authorization: 'token ' + token,
                Accept: 'application/vnd.github.squirrel-girl-preview, application/vnd.github.html+json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "body": input
            }),
            dataType: "json",
            success: function(data) {
                callback(data);
            }
        });
    }

    self.like = function(options, callback) {
        var id,token;
        if(options.issue_id == null || options.issue_id == undefined) {
            return;
        } else {
            id = options.issue_id;
        }

        if(options.token == null || options.token == undefined) {
            return false;
        } else {
            token = options.token;
        }

        $.ajax({
            type: "post",
            url: 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues/' + id + '/reactions',
            headers: {
                Authorization: 'token ' + token,
                Accept: 'application/vnd.github.squirrel-girl-preview+json'
            },
            data: JSON.stringify({
                "content": "heart"
            }),
            success: function() {
                callback();
            }
        });
    }

    self.getHeartNum = function(options, callback) {
        var id;
        if(options.issue_id == null || options.issue_id == undefined) {
            return;
        } else {
            id = options.issue_id;
        }

        $.ajax({
            type: "get",
            url: 'https://api.github.com/repos/' + self.options.name + '/' + self.options.repo + '/issues/' + id + '/reactions?content=heart',
            headers: {
                Accept: 'application/vnd.github.squirrel-girl-preview+json'
            },
            success: function(data) {
                callback(data);
            }
        });
    }
}