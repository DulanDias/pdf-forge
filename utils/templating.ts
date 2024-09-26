import Handlebars from 'handlebars';

/**
 * Compiles an HTML template using Handlebars with the given data.
 * @param templateContent The raw HTML template as a string.
 * @param data The dynamic data to be injected into the template.
 * @returns The compiled HTML with the data injected.
 */
export const compileTemplate = (templateContent: string, data: object): string => {
  const template = Handlebars.compile(templateContent);
  return template(data);
};
