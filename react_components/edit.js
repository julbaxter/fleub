"use strict";

var _ = require("lodash"),
	React = require("react"),
	request = require("superagent"),
	criteriaManagers = require("../criteria-managers"),
	injectIntl = require("react-intl").injectIntl;

module.exports = injectIntl(React.createClass({
	createCard: function(criterion) {
		var formatMessage = this.props.intl.formatMessage;
		var criterionManager = criteriaManagers[criterion.type];

		return React.DOM.div({
				className: "card",
				key: criterion.type
			},
			React.DOM.div({
					className: "card-block"
				},
				React.DOM.h4({
						className: "card-title"
					},
					formatMessage({
						id: criterionManager.name
					})
				),
				React.createElement(criterionManager.LargeCard, {
					criterion: criterion
				})
			)
		);
	},
	createLoading: function() {
		if (this.state.criteria === null) {
			return React.DOM.i({
				className: "fa fa-refresh fa-spin"
			});
		}

		return null;
	},
	getAllCriteria: function(criteria) {
		var allCriteria = _.map(criteriaManagers, function(criterionManager) {
			return _.cloneDeep(criterionManager.default);
		});

		_.forEach(criteria, function(criterion) {
			var index = _.findIndex(allCriteria, ["type", criterion.type]);

			if (index !== -1) {
				allCriteria[index] = criterion;
			}
		});

		return allCriteria;
	},
	contextTypes: {
		track: React.PropTypes.func,
		router: React.PropTypes.object.isRequired,
		lang: React.PropTypes.string
	},
	getInitialState: function() {
		return {
			criteria: null
		};
	},
	componentDidMount: function() {
		this.context.track("watchCriteria", this.state.criteria);

		request.get("/api/search/criteria").end(function(err, res) {
			if (err && err.status !== 404) {
				console.log(err);
			} else {
				this.setState({
					criteria: this.getAllCriteria(res.body)
				});
			}
		}.bind(this));
	},
	validate: function() {
		request
			.post("/api/search/criteria")
			.send(this.state.criteria)
			.end(function(err) {
				if (err) {
					console.log(err);
				}

				this.context.track("saveCriteria", this.state.criteria);
				this.context.router.push("/" + this.context.lang + "/search");
			}.bind(this));
	},
	render: function() {
		var formatMessage = this.props.intl.formatMessage;

		return React.DOM.div({
				className: "row"
			},
			React.DOM.div({
					className: "col-md-6 offset-md-3"
				},
				React.DOM.h1({
						className: "m-t-1"
					},
					formatMessage({
						id: "edit-search-criteria"
					}),
					this.createLoading()
				),
				_.map(this.state.criteria, this.createCard),
				React.DOM.button({
						className: "btn btn-primary",
						onClick: this.validate
					},
					formatMessage({
						id: "edit-search-validate"
					})
				)
			)
		);
	}
}));
