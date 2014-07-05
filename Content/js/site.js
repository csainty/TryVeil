/** @jsx React.DOM */

var templates = {
    handlebars: {
        "basic": "{{AlbumName}} - {{Artist.ArtistName}}\n{{#each Tracks}}\n{{TrackName}} - {{Length}}\n{{/each}}",
        "if": "Chart Success:\n{{#if WasUSNumberOne }}\nIt's a hit\n{{else}}\nWho listens to charts anyway?\n{{/if}}",
        "unless": "{{#unless WasUSNumberOne }}\nWho listens to charts anyway?\n{{/unless}}",
        "foreach": "{{#each Tracks}}\n{{TrackName}} - {{Length}}\n{{/each}}",
        "emptyForEach": "{{#each Reviews}}\n{{Text}}\n{{else}}\nNo Reviews Yet\n{{/each}}",
        "whitespace": "<p>\n{{~Artist.ArtistName~}}\n</p>\n\n<p>\n{{Artist.ArtistName}}\n</p>",
        "with": "{{#with Artist}}{{ArtistName}} - {{../AlbumName}}{{/with}}",
        "case-insensitive": "{{ AlbumName }}\n{{ albumName }}\n{{ albumname }}\n{{ ALBUMNAME }}\n"
    }, supersimple: {
        "basic": "@Model.AlbumName - @Model.Artist.ArtistName\n@Each.Tracks\n@Current.TrackName - @Current.Length\n@EndEach",
        "if": "Chart Success:\n@If.WasUSNumberOne\nIt's a hit\n@EndIf\n@IfNot.WasUSNumberOne\nWho listens to charts anyway?\n@EndIf",
        "foreach": "@Each.Tracks\n@Current.TrackName - @Current.Length\n@EndEach",
        "emptyForEach": "@If.HasReviews\n@Each.Reviews\n@Current.Text;\n@EndEach\n@EndIf\n@IfNot.HasReviews\nNo Reviews Yet\n@EndIf"
    }
};

var TemplateEditor = React.createClass({
    getInitialState: function() {
        return {
            template: templates.handlebars.basic,
            parser: "handlebars",
            templateName: "basic",
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
    chooseParser: function (event) {
        var parser = $(event.target).attr("data-parser"),
            templateName = this.state.templateName;
        if (!templates[parser][templateName]) {
            templateName = "basic";
        }

        this.setState({ template: templates[parser][templateName], parser: parser, templateName: templateName }, this.executeTemplate);
    },
    chooseTemplate: function (event) {
        var templateName = $(event.target).attr("data-template");
        this.setState({ templateName: templateName, template: templates[this.state.parser][templateName] }, this.executeTemplate);
    },
    executeTemplate: _.debounce(function () {
        var self = this;
       
        $.post("/" + this.state.parser, this.state.template).then(function (data) {
            self.setState({ results: data });
        });
    }, 250),
    render: function() {
        var parserOptions = _.keys(templates).map(function (parser) {
            return (
                <li className={this.state.parser === parser ? "active" : ""}><a href="#" onClick={this.chooseParser} data-parser={parser}>{parser}</a></li>
            );
        }, this);
        var templateOptions = _.keys(templates[this.state.parser]).map(function (templateName) {
            return (
                <li className={this.state.templateName === templateName ? "active" : ""}><a href="#" onClick={this.chooseTemplate} data-template={templateName}>{templateName}</a></li>
            );
        }, this);
        return (
            <div>
                <ul className="nav nav-pills">
                    {parserOptions}
                </ul>
                <ul className="nav nav-pills">
                    {templateOptions}
                </ul>
                <div className="row">
                    <div className="col-md-6">
                        <textarea value={this.state.template} onChange={this.handleTemplateChange}></textarea>
                    </div>
                    <div className="col-md-6">
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

