export interface FormSchema {
  type: string;
  layout: LayoutItem[];
  widget?: Widget;
  properties: {
    [key: string]: Property;
  };
  required?: string[];
}

export interface LayoutItem {
  type: 'layout';
  items: {
    items: string[];
    config: {
      columns: {
        content:number[];
        width: number;
      }[];
    };
  }[];
  config?: LayoutConfig;
  widget?: Widget;
}

export interface LayoutConfig {
  columns?: ColumnConfig[];
  innerPageLayout?: boolean;
}

export interface ColumnConfig {
  width: number;
  content: number[];
}

export interface Widget {
  type: 'text' | 'select' | 'date' | 'textarea';
  validationMessages: {
    pattern?: string;
    tooltip?: string,
    placeholder?: string
  }
  [key: string]: any;
}

export interface Property {
  type: string;
  title?: string;
  pattern?: string;
  widget?: FieldWidget;
  oneOf?: Option[];
  config?: Config;
  localizationData?: {
    [lang: string]: LocalizationEntry;
  };
}

export interface Config {
  title?: string;
  validationMessages?: { [key: string]: string; };
}

export interface FieldWidget {
  type: 'text' | 'select' | 'date' | 'textarea';
  validationMessages?: {
    [key: string]: string;
  };
  tooltip?: string;
  placeholder?: string;
}

export interface Option {
  const: string;
  title: string;
}

export interface LocalizationEntry {
  title?: string;
  widget?: {
    tooltip?: string;
    placeholder?: string;
  };
}
