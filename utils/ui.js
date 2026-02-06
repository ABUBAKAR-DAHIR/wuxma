export async function renderNode(node, parent) {
    if (node.type === "text") {
        const text = figma.createText();
        text.characters = node.content;
        text.fontSize = node.fontSize;
        parent.appendChild(text);
        return;
    }
    if (node.type === "rect") {
        const rect = figma.createRectangle();
        rect.resize(node.width, node.height);
        rect.cornerRadius = node.radius !== undefined ? node.radius : 0;
        rect.fills = [
            {
                type: "SOLID",
                color: node.fill !== undefined
                    ? node.fill
                    : { r: 0.9, g: 0.9, b: 0.9 },
            },
        ];
        parent.appendChild(rect);
        return;
    }
    if (node.type === "ellipse") {
        const ellipse = figma.createEllipse();
        ellipse.resize(node.width, node.height);
        ellipse.fills = [
            {
                type: "SOLID",
                color: node.fill !== undefined
                    ? node.fill
                    : { r: 0.7, g: 0.7, b: 0.7 },
            },
        ];
        parent.appendChild(ellipse);
        return;
    }
    if (node.type === "stack") {
        const frame = figma.createFrame();
        frame.layoutMode = node.direction === "horizontal" ? "HORIZONTAL" : "VERTICAL";
        frame.primaryAxisSizingMode = "AUTO";
        frame.counterAxisSizingMode = "AUTO";
        frame.itemSpacing = node.gap !== undefined ? node.gap : 12;
        const pad = node.padding !== undefined ? node.padding : 0;
        frame.paddingTop = pad;
        frame.paddingBottom = pad;
        frame.paddingLeft = pad;
        frame.paddingRight = pad;
        parent.appendChild(frame);
        for (const child of node.children) {
            await renderNode(child, frame);
        }
        return;
    }
}
// ENGINE 
export async function renderDesign(design) {
    const frame = figma.createFrame();
    frame.name = "WUXMA Design";
    // Auto Layout container
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = 16;
    frame.paddingTop = 40;
    frame.paddingBottom = 40;
    frame.paddingLeft = 40;
    frame.paddingRight = 40;
    // Optional fixed size if provided
    if (design.frame.width && design.frame.height) {
        frame.resize(design.frame.width, design.frame.height);
    }
    figma.currentPage.appendChild(frame);
    // Load font before any text creation
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    for (const node of design.nodes) {
        await renderNode(node, frame);
    }
    figma.viewport.scrollAndZoomIntoView([frame]);
}
// export Demo
function generateLayout(payload) {
    return {
        frame: {
            width: 1200,
            height: 800,
        },
        nodes: [
            {
                type: "text",
                content: payload.prompt,
                fontSize: 32,
            },
            {
                type: "rect",
                width: 360,
                height: 48,
                radius: 10,
                fill: { r: 0.1, g: 0.45, b: 1 },
            },
            {
                type: "ellipse",
                width: 120,
                height: 120,
                fill: { r: 1, g: 0.2, b: 0.4 },
            },
        ],
    };
}
