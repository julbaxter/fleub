"use strict";

var React = require("react"),
	item = require("./sidebar-item"),
	actions = require("./actions");

module.exports = React.createClass({
	handleClick: function() {
		actions.togglePanel();
	},
	render: function() {
		return React.createElement("div", {
				className: "sidebar"
			},
			React.createElement("div", {
				className: "sidebar-logo"
			}),
			React.createElement("ul", {
					className: "sidebar-nav"
				},
				React.createElement(item, {
					icon: "fa-usd",
					caption: "Price"
				}),
				React.createElement(item, {
					icon: "fa-home",
					caption: "Bedrooms"
				}),
				React.createElement(item, {
					icon: "fa-map-marker",
					caption: "Map"
				})
			),
			React.createElement("div", {
					className: "sidebar-footer"
				},
				React.createElement("div", {
						className: "share"
					},
					React.createElement("div", null, "SHARE"),
					React.createElement("ul", null,
						React.createElement("li", null, React.createElement("i", {
							className: "fa fa-google-plus-square"
						})),
						React.createElement("li", null, React.createElement("i", {
							className: "fa fa-twitter-square"
						})),
						React.createElement("li", null, React.createElement("i", {
							className: "fa fa-facebook-square"
						}))
					)
				)
			)
		);
	}
});
