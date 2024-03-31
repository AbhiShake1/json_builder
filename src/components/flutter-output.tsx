"use client"

import { useSchemaStore } from "~/stores/schema"
import { omit } from "lodash"

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const dartType = {
  string: 'String',
  object: 'Map',
  boolean: 'bool',
  array: 'List',
  integer: 'int',
  number: 'num',
  unknown: 'dynamic',
}

const primitives = omit(dartType, "object", "array", "unknown")

export function FlutterOutput() {
  const { schema } = useSchemaStore()

  let schemaJson: Record<string, unknown>

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    schemaJson = JSON.parse(JSON.parse(JSON.stringify(schema)))
  } catch (e) {
    schemaJson = {}
  }

  const title = toTitleCase((schemaJson.title ?? "") as string)

  const type = (schemaJson.type ?? 'dynamic') as keyof typeof dartType
  const dType = dartType[type]

  const output = `
class JsonRenderer${title}Plugin extends JsonRendererPlugin {
  JsonRenderer${title}Plugin({super.key});

  @override
  JsonRendererSchema get schema => {
        'text': JsonRendererValidator.ofType(${dType}),
        'text_style': JsonRendererValidator.fromMap({
          'font_style': JsonRendererValidator.ofType(String),
          'font_size': JsonRendererValidator.ofType(double),
        }),
      };

  @override
  Widget build(BuildContext context) {
    final textStyle = params['text_style'];
    final fontStyle = textStyle?['font_style']?.toString();
    return Text(
      params['text']?.toString() ?? '',
      style: TextStyle(
        fontStyle: fontStyle == null ? null : enumByName(FontStyle.values, fontStyle),
        fontSize: textStyle?['font_size'] as double?,
      ),
    );
  }

  @override
  String get type => 'text';
}
	`

  return <pre>
    <code>{output}</code>
  </pre>
}
