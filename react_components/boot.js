"use strict";

var React = require("react"),
	ReactDOM = require("react-dom"),
	Router = require("react-router").Router,
	Route = require("react-router").Route,
	IndexRoute = require("react-router").IndexRoute,
	browserHistory = require("react-router").browserHistory,
	request = require("superagent"),
	Loading = require("./loading"),
	Keen = require("keen-js"),
	client = new Keen({
		projectId: process.env.KEEN_PROJECT_ID,
		writeKey: process.env.KEEN_WRITE_KEY
	});

// Intl polyfill (mainly for Safari)
require("intl");
require("intl/locale-data/jsonp/en.js");
require("intl/locale-data/jsonp/fr.js");

var Boot = React.createClass({
	track: function(type, value) {
		client.addEvent("app", {
			user: this.state.user,
			type: type,
			value: value
		});
	},
	redirect: function(pathIfLogged, pathIfNotLogged) {
		return function(nextState, replace) {
			var isLogged = this.state.user !== null;

			if (pathIfLogged && isLogged) {
				replace(pathIfLogged.split("/").join("/" + nextState.params.lang + "/"));
			}

			if (pathIfNotLogged && !isLogged) {
				replace(pathIfNotLogged.split("/").join("/" + nextState.params.lang + "/"));
			}
		}.bind(this);
	},
	getInitialState: function() {
		return {
			user: undefined
		};
	},
	childContextTypes: {
		user: React.PropTypes.object,
		track: React.PropTypes.func
	},
	getChildContext: function() {
		return {
			user: this.state.user,
			track: this.track
		};
	},
	componentWillMount: function() {
		request
			.get("/api/user")
			.end(function(err, res) {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						user: res.body
					});
				}
			}.bind(this));
	},
	render: function() {
		if (this.state.user === undefined) {
			return React.createElement(Loading);
		}

		return React.createElement(Router, {
				history: browserHistory
			},
			React.createElement(Route, {
					path: "/:lang",
					component: require("./app")
				},
				React.createElement(IndexRoute, {
					component: require("./apartment-router"),
					onEnter: this.redirect(null, "/signup")
				}),
				React.createElement(Route, {
					path: "apt/:_id",
					component: require("./apartment-router")
				}),
				React.createElement(Route, {
					path: "admin",
					component: require("./admin"),
					onEnter: this.redirect(null, "/signin?next=/admin")
				}),
				React.createElement(Route, {
					path: "posted",
					component: require("./posted"),
					onEnter: this.redirect(null, "/signin?next=/posted")
				}),
				React.createElement(Route, {
					path: "search",
					component: require("./search"),
					onEnter: this.redirect(null, "/signin?next=/search")
				}),
				React.createElement(Route, {
					path: "search/edit",
					component: require("./edit"),
					onEnter: this.redirect(null, "/signin?next=/search/edit")
				}),
				React.createElement(Route, {
					path: "settings",
					component: require("./settings"),
					onEnter: this.redirect(null, "/signin?next=/settings")
				}),
				React.createElement(Route, {
					path: "signin",
					component: require("./signin")
				}),
				React.createElement(Route, {
					path: "signup",
					component: require("./signup"),
					onEnter: this.redirect("/", null)
				})
			)
		);
	}
});

ReactDOM.render(React.createElement(Boot), document.getElementById("container"));
