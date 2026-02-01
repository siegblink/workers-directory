// Global type declarations for non-TypeScript imports

// CSS Modules
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Plain CSS imports (side-effect imports like './globals.css')
declare module "*.css";
