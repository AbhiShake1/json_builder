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

  const properties = (schemaJson.properties ?? {}) as Record<string, unknown>
  const schemaProcessed = Object.entries(properties).map(([key, value]) => {
    const type = (value as Record<string, unknown>).type as keyof typeof dartType
    const dType = dartType[type]

    if (Object.keys(primitives).includes(type)) return `'${key}': JsonRendererValidator.ofType(${dType}),`
    // TODO(AbhiShake1): handle array
    return `
        'text_style': JsonRendererValidator.fromMap({
          'font_style': JsonRendererValidator.ofType(String),
          'font_size': JsonRendererValidator.ofType(double),
        }),
		`
  })

  const buildProcessed = Object.entries(properties).map(([key, value]) => {
    const type = (value as Record<string, unknown>).type as keyof typeof dartType
    const dType = dartType[type]

    if (Object.keys(primitives).includes(type)) return `
		${key}: params['${key}'] as ${dType}?,
		`
    // TODO(AbhiShake1): handle array
    return `
        'text_style': JsonRendererValidator.fromMap({
          'font_style': JsonRendererValidator.ofType(String),
          'font_size': JsonRendererValidator.ofType(double),
        }),
		`
  })

  const output = `
class JsonRenderer${title}Plugin extends JsonRendererPlugin {
  JsonRenderer${title}Plugin({super.key});

  @override
  JsonRendererSchema get schema => {
        ${schemaProcessed.join('')}
      };

  @override
  Widget build(BuildContext context) {
    final textStyle = params['text_style'];
    final fontStyle = textStyle?['font_style']?.toString();
    return ${title}(
		${buildProcessed.join('')}
      params['text']?.toString() ?? '',
      style: TextStyle(
        fontStyle: fontStyle == null ? null : enumByName(FontStyle.values, fontStyle),
        fontSize: textStyle?['font_size'] as double?,
      ),
    );
  }

  @override
  String get type => '${title}';
}
	`

  return <pre>
    <code>{output}</code>
  </pre>
}
