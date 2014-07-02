/** @jsx React.DOM */

var TemplateEditor = React.createClass({
    getInitialState: function() {
        return {
            template: "{{AlbumName}} - {{Artist}}\n{{#each Tracks}}\n{{TrackName}} - {{Length}}\n{{/each}}",
            parser: "handlebars",
            results: ""
        };
    },
    handleTemplateChange: function(event) {
        var self = this;
        this.setState({template: event.target.value }, this.executeTemplate);
    },
    handleParserChange: function (event) {
        this.setState({ parser: event.target.value }, this.executeTemplate);
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
        return (
            <div>
                Choose Parser:
                <select value={this.state.parser} onChange={this.handleParserChange}>
                    <option value="handlebars">Veil.Handlebars</option>
                    <option value="supersimple">Veil.SuperSimple</option>
                </select>
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

