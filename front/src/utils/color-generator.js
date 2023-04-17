import value from 'assets/scss/_themes-vars.module.scss';

export async function colorGenerator(a) {
    let ans;
    const hour = new Date(a).getHours();
    if (hour >= 0 && hour < 8) {
        ans = value.primary200;
    } else if (hour >= 8 && hour < 16) {
        ans = value.secondary200;
    } else {
        ans = value.grey500;
    }
    return ans;
}
