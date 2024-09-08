import { useElement, JSXAttributes } from './core/element.js'

const name = 's-bottom-sheet'
const props = {
}

const style = /*css*/`
:host{
  display: inline-block;
  vertical-align: middle;
}
.wrapper{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-index, 2);
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.scrim{
  background: color-mix(in srgb, var(--s-color-scrim, #000000) 80%, transparent);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: opacity(0);
  transition: filter .2s;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  pointer-events: none;
}
.wrapper.show .scrim{
  filter: opacity(1);
  pointer-events: auto;
}
.container{
  position: relative;
  border-radius: 24px 24px 0 0;
  max-width: 520px;
  width: 100%;
  max-height: calc(100% - 56px);
  background: var(--s-color-surface-container-highest, #e5e1e6);
  display: flex;
  flex-direction: column;
  top: 100%;
  --z-index: var(--z-index, 2);
}
.show.wrapper .container{
  top: 0;
  pointer-events: auto;
  box-shadow: var(--s-elevation-level1, 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12));
}
.drag{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}
.drag::before{
  content: '';
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--s-color-on-surface-variant, #46464f);
  opacity: .4;
}
::slotted([slot=view]){
  flex-grow: 1;
  min-height: 280px;
  overscroll-behavior: none;
}
`

const template = /*html*/`
<slot name="trigger"></slot>
<div class="wrapper" part="wrapper">
  <div class="scrim" part="scrim"></div>
  <div class="container" part="container">
    <div class="drag" part="drag"></div>
    <slot name="view"></slot>
  </div>
</div>
`

export class BottomSheet extends useElement({
  style, template, props,
  setup(shadowRoot) {
    const trigger = shadowRoot.querySelector('slot[name=trigger]') as HTMLElement
    const wrapper = shadowRoot.querySelector('.wrapper') as HTMLDivElement
    const scrim = shadowRoot.querySelector('.scrim') as HTMLDivElement
    const container = shadowRoot.querySelector('.container') as HTMLDivElement
    const show = () => {
      wrapper.classList.add('show')
      container.animate([{ transform: 'translateY(100%)', top: 0 }, { transform: 'translateY(0%)', top: 0 }], { duration: 200 })
      this.dispatchEvent(new Event('show'))
    }
    const dismiss = () => {
      wrapper.classList.remove('show')
      container.animate([{ transform: 'translateY(0%)', top: 0 }, { transform: 'translateY(100%)', top: 0 }], { duration: 200 })
      this.dispatchEvent(new Event('dismiss'))
    }
    trigger.addEventListener('click', show)
    scrim.addEventListener('click', dismiss)
    return {
      expose: { show, dismiss }
    }
  }
}) { }

BottomSheet.define(name)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [name]: Partial<typeof props> & JSXAttributes
    }
  }
  interface HTMLElementTagNameMap {
    [name]: BottomSheet
  }
}

//@ts-ignore
declare module 'vue' {
  export interface GlobalComponents {
    [name]: typeof props
  }
}