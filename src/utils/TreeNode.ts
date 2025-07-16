import Data from './Data';

class TreeNode {
    static nextID = 0;
    data: Data;
    readonly children: Array<TreeNode>;
    private parent: TreeNode | null;
    private readonly coordinate: number[];
    private id: number;

    constructor(data: Data) {
        this.data = data;
        this.children = [];
        this.parent = null;
        this.coordinate = [0, 0];
        this.id = TreeNode.nextID++;
    }

    addChild(child: TreeNode) {
        this.children.push(child);
        child.parent = this;
    }

    setCoordinateX(x: number) {
        this.coordinate[0] = x;
    }

    setCoordinateY(y: number) {
        this.coordinate[1] = y;
    }

    getCoordinateX() {
        return this.coordinate[0];
    }

    getCoordinateY() {
        return this.coordinate[1];
    }

    getIDPath() {
        const path: Array<number> = [];
        let current: TreeNode | null = this;
        while (current !== null) {
            path.unshift(current.id);
            current = current.parent;
        }

        return path;
    }

    getRoot(current: TreeNode) {
        while (current.parent !== null) {
            current = current.parent;
        }
        return current;
    }

    removeNode(nodeToRemove: TreeNode) {
        if (nodeToRemove === this) {
            return false; // Can't remove root
        }
        return this.removeNodeRecursive(this, nodeToRemove);
    }

    removeNodeRecursive(parent: TreeNode, nodeToRemove: TreeNode) {
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            if (child === nodeToRemove) {
                parent.children.splice(i, 1);
                return true;
            }
            if (this.removeNodeRecursive(child, nodeToRemove)) {
                return true;
            }
        }
        return false;
    }

    getNodeByPath(path: number[]) {
        if (!path || path.length === 0) return null;
        if (path.length === 1) return this;

        const remainingPath = path.slice(1);
        let currentNode: TreeNode | null = this;

        for (const id of remainingPath) {
            let nextNode: TreeNode | null = null;
            for (const child of currentNode.children) {
                if (child.id === id) {
                    nextNode = child;
                    break;
                }
            }
            if (!nextNode) return null;
            currentNode = nextNode;
        }
        return currentNode;
    }

    searchCoordinate(x: number, y: number): TreeNode | null {
        if (x < this.coordinate[0] + 160 && x > this.coordinate[0] - 15 &&
            Math.abs(this.coordinate[1] - y) < 6) {
            return this;
        }

        for (const child of this.children) {
            const result: TreeNode | null = child.searchCoordinate(x, y);
            if (result) return result;
        }
        return null;
    }

    returnFrequencies(): Array<number> {
        const frequencies = [];
        if (!this.data.isMuted) {
            frequencies.push(this.data.frequency);
        }
        for (const child of this.children) {
            frequencies.push(...child.returnFrequencies());
        }
        return frequencies;
    }

    rootCoordinate(howUp: number) {
        this.setCoordinateY(this.getCoordinateY() + howUp);
        for (const child of this.children) {
            child.rootCoordinate(howUp);
        }
    }

    clone(): TreeNode {
        const clonedData = this.data.clone();
        const clonedNode = new TreeNode(clonedData);

        clonedNode.setCoordinateX(this.getCoordinateX());
        clonedNode.setCoordinateY(this.getCoordinateY());

        for (const child of this.children) {
            const clonedChild = child.clone();
            clonedNode.addChild(clonedChild);
        }

        return clonedNode;
    }
}

export default TreeNode;