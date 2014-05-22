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
                ```javascript
                componentID: { fieldName: valueOrBinding }
                ```
            </td>
            <td>
                ```javascript
                var protoTree = {
                    mainHeader: "Carving Woods",
                    sectionHeader1: "Sassafras",
                    sectionHeader1: "Butternut",
                    sectionHeader1: "Basswood"
                };
                ```
            </td>
        </tr>
        <tr>
            <th>Array of Bound</th>
            <td>repeated Bound fields</td>
            <td>
                ```javascript
                componentID: { 
                    fieldName: [
                        valueOrBinding1,
                        valueOrBinding2,
                        ...
                    ]
                }
                ```
            </td>
            <td>
                ```javascript
                var protoTree = {
                    mainHeader: "Carving Woods",
                    sectionHeaders: [
                        "Sassafras",
                        "Butternut",
                        "Basswood"
                    ]
                };
                ```
            </td>
        </tr>
        <tr>
            <th>Selection</th>
            <td>
                A selection control where a user chooses either one or many options from a set of alternatives, such as a drop-down
            </td>
            <td>
                ```javascript
                componentID: {
                    selection: valueOrBinding,
                    optionlist: [array of internal values],
                    optionnames: [array of display strings]
                }
                ```
                For information on how to create trees for radio buttons and checkboxes, see <a href="RendererComponentTreeExpanders.md">Renderer Component Tree Expanders</a>.
            </td>
            <td>
                ```javascript
                var protoTree = {
                    contact-addressType1: {
                        selection: "${fields.addressType1}",
                        optionlist: ["Home", "Work"],
                        optionnames: ["home", "work"]
                    }
                };
                ```
            </td>
        </tr>
        <tr>
            <th>Link</th>
            <td>
                A reference to a URL, such as a hyperlink
            </td>
            <td>
                ```javascript
                componentID: {
                    target: destinationUrl,
                    linktext: stringToDisplay
                }
                ```
            </td>
            <td>
                ```javascript
                var protoTree = {
                    contact-addressType1: {
                        target: "http://company.com/help/${topic.url}",
                        linktext: "${topic.name}"
                    }
                };
                ```
            </td>
        </tr>
        <tr>
            <th>Container</th>
            <td>
                A component that contains other components in a free-form way
            </td>
            <td>
                ```javascript
                componentID: {
                    children: [array of other protocomponents]
                }
                ```
            </td>
            <td></td>
        </tr>
        <tr>
            <th>Message</th>
            <td>
                A component that encapsulates the data needed to resolve a localised message. Similar to a Bound, but the value is a key into a string bundle
            </td>
            <td>
                ```javascript
                componentID: {
                    messageKey: key,
                    args: [/* array of arguments to be interpolated into the message format */]
                }
                ```
                See <a href="fluid.formatMessage.md">fluid.formatMessage</a> for more information about message formatting.
            </td>
            <td>
                ```javascript
                var protoTree = {
                    instructions: {
                        messageKey: "instructionKey",
                        args: ["thing", 3, "%path1"]
                    }
                };
                ```
            </td>
        </tr>
    </tbody>
</table>
