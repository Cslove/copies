// css.d.ts
// Type declarations for CSS modules and stylesheets

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css';
