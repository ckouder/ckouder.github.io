export const rectAreOverlapping = (
	x11: number,
	x12: number,
	y11: number,
	y12: number,
	x21: number,
	x22: number,
	y21: number,
	y22: number
) => {
	return !(x11 > x22 || x12 < x21 || y11 > y22 || y12 < y21);
};

export const pointInside = (
	x: number,
	y: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
) => {
	return x >= x1 && x <= x2 && y >= y1 && y <= y2;
};
