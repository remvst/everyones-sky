class PathNodeSet {

    constructor() {
        this.nodeMap = {};
        this.nodeList = [];
    }

    addNode(nodeKey, node) {
        if (!this.fetchNode(nodeKey)) {
            this.nodeList.push(node);
            this.nodeMap[nodeKey] = node;
        }
    }

    fetchNode(nodeKey) {
        return this.nodeMap[nodeKey];
    }

    removeNode(nodeKey) {
        const node = this.fetchNode(nodeKey);
        if (node) {
            const nodeIndex = this.nodeList.indexOf(node);
            if (nodeIndex >= 0) {
                this.nodeList.splice(nodeIndex, 1);
            }

            delete this.nodeMap[nodeKey];
        }
    }

}

class PathNode {

    constructor(node, parent = null, distance = 0) {
        this.node = node;
        this.parent = parent;
        this.distance = distance;
    }

}

class PathFinder {

    constructor(options) {
        this.funcs = {};
        this.funcs.hash = options.hash;
        this.funcs.neighbors = options.neighbors;
        this.funcs.heuristic = options.heuristic;
        this.funcs.isTarget = options.isTarget;
        this.funcs.distance = options.distance;
    }

    hashFor(node) {
        return this.funcs.hash(node);
    }

    neighborsFor(node) {
        return this.funcs.neighbors(node);
    }

    heuristicFor(node, target) {
        return this.funcs.heuristic(node, target);
    }

    isTarget(node, target) {
        return this.funcs.isTarget(node, target);
    }

    distanceBetween(nodeA, nodeB) {
        return this.funcs.distance(nodeA, nodeB);
    }

    findPath(sources, target) {
        const expandable = new PathNodeSet();
        const expanded = new PathNodeSet();

        // Add the initial node
        sources.forEach(sourceNode => {
            expandable.addNode(this.hashFor(sourceNode), new PathNode(sourceNode));
        });

        let finalPathNode;

        const expandedOrder = [];

        for (let step = 0 ; step < 100 ; step++) {
            const pathElement = this.closestExpandable(expandable, target);
            if (!pathElement) {
                break;
            }

            if (this.isTarget(pathElement.node, target)) {
                finalPathNode = pathElement;
                break;
            }

            this.expand(pathElement, expandable, expanded);
            expandedOrder.push(pathElement.node);
        }

        const steps = [];
        let pathNode = finalPathNode;
        while (pathNode) {
            steps.unshift(pathNode.node);
            pathNode = pathNode.parent;
        }

        return steps;
    }

    closestExpandable(expandableSet, target) {
        let closestNode = null;
        let closestHeuristic;

        expandableSet.nodeList.forEach(pathElement => {
            const heuristic = this.heuristicFor(pathElement.node, target) + pathElement.distance;
            if (!closestNode || heuristic < closestHeuristic) {
                closestNode = pathElement;
                closestHeuristic = heuristic;
            }
        });

        return closestNode;
    }

    expand(pathElement, expandableSet, expandedSet) {
        // Mask as expanded
        const nodeHash = this.hashFor(pathElement.node);

        expandedSet.addNode(nodeHash, pathElement);
        expandableSet.removeNode(nodeHash);

        // Actually expand
        const neighbors = this.neighborsFor(pathElement.node);
        neighbors.forEach(neighborNode => {
            const neighborHash = this.hashFor(neighborNode);
            const neighborDistance = pathElement.distance + this.distanceBetween(pathElement.node, neighborNode);

            const alreadyExpanded = expandedSet.fetchNode(neighborHash);
            if (alreadyExpanded) {
                if (alreadyExpanded.distance > neighborDistance) {
                    // Update properties
                    alreadyExpanded.distance = neighborDistance;
                    alreadyExpanded.parent = pathElement;

                    // Allow it to be expanded again since we found a shortcut
                    expandableSet.addNode(neighborHash, alreadyExpanded);
                    expandedSet.removeNode(alreadyExpanded);
                }
                return;
            }

            expandableSet.addNode(neighborHash, new PathNode(neighborNode, pathElement, neighborDistance));
        });
    }

}

// module.exports = PathFinder;