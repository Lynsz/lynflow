class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class IntersectionObserverMock {
    readonly root = null
    readonly rootMargin = ""
    readonly thresholds = []

    disconnect() {}
    observe() {}
    takeRecords() {
        return []
    }
    unobserve() {}
}

Object.defineProperty(window, "ResizeObserver", {
    writable: true,
    value: ResizeObserverMock,
})

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverMock,
})

Object.defineProperty(globalThis, "ResizeObserver", {
    writable: true,
    value: ResizeObserverMock,
})

Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: IntersectionObserverMock,
})
