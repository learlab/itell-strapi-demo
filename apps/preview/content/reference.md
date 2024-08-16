## Modules

<dl>
<dt><a href="#module_Accordion">Accordion</a></dt>
<dd><p>Top-level accordion wrapper</p></dd>
<dt><a href="#module_AccordionItem">AccordionItem</a></dt>
<dd><p>An item in the accordion</p></dd>
<dt><a href="#module_Blockquote">Blockquote</a></dt>
<dd><p>Blockquote</p></dd>
<dt><a href="#module_Callout">Callout</a></dt>
<dd><p>General callout component for displaying information, warnings, and cautions.</p></dd>
<dt><a href="#module_Image">Image</a></dt>
<dd><p>Image</p></dd>
<dt><a href="#module_Sandbox">Sandbox</a></dt>
<dd><p>JavaScript Sandbox</p></dd>
</dl>

<a name="module_Accordion"></a>

## Accordion
<p>Top-level accordion wrapper</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code> | <p>The value of the accordion item to be expanded. If not provided, all items will be collapsed.</p> |
| children |  | <p>nested elements</p> |

**Example**  
```tsx
<accordion-wrapper value="1">
	<accordion-item value="1" title="Item 1">
		<p>Item 1 content</p>
	</accordion-item>
	<accordion-item value="2" title="Item 2">
		<p>Item 2 content</p>
	</accordion-item>
</accordion-wrapper>
```
<a name="module_AccordionItem"></a>

## AccordionItem
<p>An item in the accordion</p>


| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | <p>The identifier for the accordion item, must be unique inside the same accordion</p> |
| title | <code>string</code> | <p>The title of the accordion item, optional. If not provided, the title will be the value.</p> |
| children |  | <p>nested elements</p> |

<a name="module_Blockquote"></a>

## Blockquote
<p>Blockquote</p>


| Param | Type | Description |
| --- | --- | --- |
| children |  | <p>blockquote content</p> |
| author | <code>string</code> | <p>blockquote author, optional</p> |
| role | <code>string</code> | <p>blockquote author role, optional</p> |

**Example**  
```js
<i-blockquote author="John Doe" role="CEO">
	This is a blockquote
</i-blockquote>
```
<a name="module_Callout"></a>

## Callout
<p>General callout component for displaying information, warnings, and cautions.</p>


| Param | Description |
| --- | --- |
| title | <p>The title of the callout, optional. If not provided, the title will be &quot;Note&quot;, &quot;Warning&quot;, or &quot;Caution&quot; based on the variant. Defaults to &quot;Note&quot;.</p> |
| variant | <p>The variant of the callout, &quot;info&quot;, &quot;warning&quot;, or &quot;danger&quot;. Defaults to &quot;info&quot;.</p> |
| children | <p>nested elements</p> |

**Example**  
```js
<i-callout variant="info">	
	this is **important**
</i-callout>
```
<a name="module_Image"></a>

## Image
<p>Image</p>


| Param | Description |
| --- | --- |
| src | <p>The source of the image</p> |
| alt | <p>The alt text of the image, <strong>dont foreget this!</strong></p> |
| width | <p>The width of the image, default to 600px</p> |
| height | <p>The height of the image, default to 400px</p> |
| children | <p>nested elements, if provided, will be used as the caption when image is expanded</p> |

**Example**  
```js
<i-image
style="aspect-ratio:678/435;"
src="https://nbjrajrmujlgxmcvqsge.supabase.co/storage/v1/object/public/strapi/files/1.1.png-e1cb314dd72c8b8360d0cdddc949b81f.png"
alt="Illustration of a sea of dark and bright dots (bits) with islands in it"
width="678"
height="435"
/>
```
<a name="module_Sandbox"></a>

## Sandbox
<p>JavaScript Sandbox</p>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>undefined</code> | <p>The id of the sandbox. If not provided, a random id will be generated.</p> |
| code | <code>string</code> | <p>The code to run in the sandbox</p> |

**Example**  
```js
<i-sandbox-js
	id="hello-world-example"
	code="console.log('Hello, world!');"
/>
```
