// src/declarations.d.ts
declare module "*.json" {
    const value: any;
    export default value;

  }
  declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
  }