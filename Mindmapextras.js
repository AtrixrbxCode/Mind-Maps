class MindMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.selectedNode = null;
        this.connections = [];
    }

    // Create a new node
    createNode() {
        const node = document.createElement('div');
        node.className = 'node';
        node.textContent = 'New Node';
        node.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        node.style.left = Math.random() * (window.innerWidth - 100) + 'px';

        this.addDragAndTouchEvents(node);

        node.addEventListener('click', () => this.selectNode(node));
        node.addEventListener('dblclick', () => this.enableEditing(node));
        node.addEventListener('blur', () => this.disableEditing(node));

        this.canvas.appendChild(node);
    }

    // Add drag-and-drop functionality
    addDragAndTouchEvents(node) {
        let offsetX = 0, offsetY = 0;

        const startDrag = (e) => {
            if (node.isContentEditable) return; // Skip if editing
            offsetX = (e.touches ? e.touches[0].clientX : e.clientX) - node.offsetLeft;
            offsetY = (e.touches ? e.touches[0].clientY : e.clientY) - node.offsetTop;
            document.addEventListener(e.touches ? 'touchmove' : 'mousemove', drag);
            document.addEventListener(e.touches ? 'touchend' : 'mouseup', stopDrag);
        };

        const drag = (e) => {
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            node.style.left = x - offsetX + 'px';
            node.style.top = y - offsetY + 'px';
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', stopDrag);
        };

        node.addEventListener('mousedown', startDrag);
        node.addEventListener('touchstart', startDrag);
    }

    // Select a node for further actions
    selectNode(node) {
        if (this.selectedNode) {
            this.selectedNode.style.border = '2px solid #28a745'; // Deselect current
        }
        this.selectedNode = node;
        this.selectedNode.style.border = '2px solid #007bff'; // Highlight selected
    }

    // Enable editing mode
    enableEditing(node) {
        node.contentEditable = true;
        node.focus();
    }

    // Disable editing mode
    disableEditing(node) {
        node.contentEditable = false;
    }

    // Delete the currently selected node
    deleteSelectedNode() {
        if (this.selectedNode) {
            this.canvas.removeChild(this.selectedNode);
            this.selectedNode = null;
        }
    }

    // Change the color of the selected node
    changeNodeColor() {
        if (this.selectedNode) {
            const color = document.getElementById('colorPicker').value;
            this.selectedNode.style.backgroundColor = color;
        }
    }

    // Save the mind map as JSON
    saveMindMap() {
        const nodes = [...this.canvas.children].map(node => ({
            text: node.textContent,
            top: node.style.top,
            left: node.style.left,
            color: node.style.backgroundColor,
        }));

        localStorage.setItem('mindMap', JSON.stringify(nodes));
        alert('Mind map saved!');
    }

    // Load the mind map from JSON
    loadMindMap() {
        const nodes = JSON.parse(localStorage.getItem('mindMap') || '[]');
        this.canvas.innerHTML = ''; // Clear canvas

        nodes.forEach(data => {
            const node = document.createElement('div');
            node.className = 'node';
            node.textContent = data.text;
            node.style.top = data.top;
            node.style.left = data.left;
            node.style.backgroundColor = data.color || 'white';

            this.addDragAndTouchEvents(node);
            node.addEventListener('click', () => this.selectNode(node));
            node.addEventListener('dblclick', () => this.enableEditing(node));
            node.addEventListener('blur', () => this.disableEditing(node));

            this.canvas.appendChild(node);
        });
    }
}

// Initialize the Mind Map
const mindMap = new MindMap('canvas');
