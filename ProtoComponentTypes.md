# ProtoComponent Types #

_**Note:** The renderer will undergo significant changes post Infusion 1.5_

The Renderer categorizes components into different types depending on the nature of the data that is to be rendered. Different component types will have different fields, but in general, the values of the fields will contain either the actual data or a reference to a data model containing the data. The component types are not stated explicitly in the object, but the type is inferred by the Renderer based on the presence of particular fields.

The following tables describe the different types of components and the fields used by each component. In these tables, field names shown in bold text are the definitive fields that will indicate which type of component is being described.

<table>
    <thead>
        <tr>
            <th>Type</th>
            <th>Description</th>
            <th>Format</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Bound</th>
            <td>
                A control which holds a single value, such as headers, labels, etc.
            </td>
            <td>
            <!-- elements in <pre> aren't indented, as all the whitespace is included in the output -->
                <pre><code>
componentID: { fieldName: valueOrBinding }
                </code></pre>
            </td>
            <td>
                <pre><code>
var protoTree = {
    mainHeader: "Carving Woods",
    sectionHeader1: "Sassafras",
    sectionHeader1: "Butternut",
    sectionHeader1: "Basswood"
};
                </code></pre>
            </td>
        </tr>
        <tr>
            <th>Array of Bound</th>
            <td>repeated Bound fields</td>
            <td>
                <pre><code>
componentID: {
    fieldName: [
        valueOrBinding1,
        valueOrBinding2,
        ...
    ]
}
                </code></pre>
            </td>
            <td>
                <pre><code>
var protoTree = {
    mainHeader: "Carving Woods",
    sectionHeaders: [
        "Sassafras",
        "Butternut",
        "Basswood"
    ]
};
                </code></pre>
            </td>
        </tr>
        <tr>
            <th>Selection</th>
            <td>
                A selection control where a user chooses either one or many options from a set of alternatives, such as a drop-down
            </td>
            <td>
                <pre><code>
componentID: {
    selection: valueOrBinding,
    optionlist: [array of internal values],
    optionnames: [array of display strings]
}
                </code></pre>
                For information on how to create trees for radio buttons and checkboxes, see <a href="RendererComponentTreeExpanders.md">Renderer Component Tree Expanders</a>.
            </td>
            <td>
                <pre><code>
var protoTree = {
    contact-addressType1: {
        selection: "${fields.addressType1}",
        optionlist: ["Home", "Work"],
        optionnames: ["home", "work"]
    }
};
                </code></pre>
            </td>
        </tr>
        <tr>
            <th>Link</th>
            <td>
                A reference to a URL, such as a hyperlink
            </td>
            <td>
                <pre><code>
componentID: {
    target: destinationUrl,
    linktext: stringToDisplay
}
                </code></pre>
            </td>
            <td>
                <pre><code>
var protoTree = {
    contact-addressType1: {
        target: "http://company.com/help/${topic.url}",
        linktext: "${topic.name}"
    }
};
                </code></pre>
            </td>
        </tr>
        <tr>
            <th>Container</th>
            <td>
                A component that contains other components in a free-form way
            </td>
            <td>
                <pre><code>
componentID: {
    children: [array of other protocomponents]
}
                </code></pre>
            </td>
            <td></td>
        </tr>
        <tr>
            <th>Message</th>
            <td>
                A component that encapsulates the data needed to resolve a localised message. Similar to a Bound, but the value is a key into a string bundle
            </td>
            <td>
                <pre><code>
componentID: {
    messageKey: key,
    args: [] // array of arguments to be interpolated into the message format
}
                </code></pre>
                See <a href="fluid.formatMessage.md">fluid.formatMessage</a> for more information about message formatting.
            </td>
            <td>
                <pre><code>
var protoTree = {
    instructions: {
        messageKey: "instructionKey",
        args: ["thing", 3, "%path1"]
    }
};
                </code></pre>
            </td>
        </tr>
    </tbody>
</table>
