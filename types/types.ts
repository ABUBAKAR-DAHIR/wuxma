export type DesignNode =
    {
      type: "text"
      content: string
      fontSize: number
    }
  | {
      type: "rect"
      width: number
      height: number
      radius?: number
      fill?: { r: number; g: number; b: number }
    }
  | {
      type: "ellipse"
      width: number
      height: number
      fill?: { r: number; g: number; b: number }
    }
  |
  {
    type: "stack"
    direction: "vertical" | "horizontal"
    gap?: number
    padding?: number
    children: DesignNode[]
  }


export type DesignSchema = {
  frame: {
    width: number
    height: number
  }
  nodes: DesignNode[]
}


export type Payload = {
  prompt: string,
  style: string,
  platform: string
}
