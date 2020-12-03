trees = set()
for r, line in enumerate(open('input03.txt').readlines()):
    line = line.strip()
    for c, symbol in enumerate(line):
        if symbol == '#':
            trees.add((r, c))
width = len(line)


def count_trees(slope, trees, r, width):
    pos = (0, 0)
    tree_count = 0
    while pos[0] <= r:
        new_pos = pos[0] + slope[0], (pos[1] + slope[1]) % width
        if new_pos in trees:
            tree_count += 1
        pos = new_pos

    return tree_count


print(f"part 1: {count_trees(slope=(1, 3), trees=trees, r=r, width=width)}")


def prod(array):
    if len(array) > 1:
        return array[0] * prod(array[1:])
    else:
        return array[0]


slopes = [(1, 1), (1, 3), (1, 5), (1, 7), (2, 1)]
print(f"part 2: {prod([count_trees(slope, trees, r, width) for slope in slopes])}")

###############################################################################

