/** @jsx React.DOM */

var templates = {
    handlebars: {
        basic: "{{AlbumName}} - {{Artist}}\n{{#each Tracks}}\n{{TrackName}} - {{Length}}\n{{/each}}"
    }, supersimple: {
        basic: "@Model.AlbumName - @Model.Artist\n@Each.Tracks\n@Current.TrackName - @Current.Length\n@EndEach"
    }
};

var TemplateEditor = React.createClass({
    getInitialState: function() {
        return {
            template: templates.handlebars.basic,
            parser: "handlebars",
            results: ""
        };
    },
    componentDidMount: function () {
        this.executeTemplate();
    },
    handleTemplateChange: function(event) {
        var self = this;
        this.setState({template: event.target.value }, this.executeTemplate);
    },
    chooseHandlebars: function () {
        this.setState({ template: templates.handlebars.basic, parser: "handlebars" }, this.executeTemplate);
    },
    chooseSuperSimple: function () {
        this.setState({ template: templates.supersimple.basic, parser: "supersimple" }, this.executeTemplate);
    },
    handleSubmit: function (event) {
        this.executeTemplate();
    },
    executeTemplate: _.debounce(function () {
        var self = this;
       
        $.post("/" + this.state.parser, this.state.template).then(function (data) {
            self.setState({ results: data });
        });
    }, 500),
    render: function() {
        var handlebarsClassName = this.state.parser === "handlebars" ? "active" : "",
            superSimpleClassName = this.state.parser === "supersimple" ? "active" : "";
        return (
            <div>
                Choose Parser:
                <ul className="nav nav-pills">
                    <li className={handlebarsClassName}><a href="#" onClick={this.chooseHandlebars}>Veil.Handlebars</a></li>
                    <li className={superSimpleClassName}><a href="#" onClick={this.chooseSuperSimple}>Veil.SuperSimple</a></li>
                </ul>
                <div className="row">
                    <div className="col-md-5">
                        <textarea value={this.state.template} onChange={this.handleTemplateChange}></textarea>
                    </div>
                    <div className="col-md-2 middle-column">
                        <button onClick={this.handleSubmit}>Render</button>
                    </div>
                    <div className="col-md-5">
                        <textarea value={this.state.results}></textarea>
                    </div>
               </div>
            </div>
        );
    }
});

React.renderComponent(
    <TemplateEditor />,
    document.getElementById("template-editor")
);

