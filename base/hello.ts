function greet(person: string, date: Date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}`);
}

greet("Brendan", new Date());

/// 常量类型结合union type 的使用
function printText(s: string, alignment: "left" | "right" | "center") {
    console.log(`alignment is ${alignment}`)
}


/// 操作符

// 键值获取keyof
type Person = {
    name: string;
    age: number;
}

type PersonKey = keyof Person; // PersonKey得到的类型为 "name" | "age"

const Nan: PersonKey = "name";

function getValue (p: Person, k: keyof Person) {
    return p[k];
}

// 实例类型获取typeof (获取一个对象/实例的类型)
const me: Person = { name: 'gzx', age: 16};
type P = typeof me;
const you: typeof me = {name: 'Nan', age: 26};

const typestr = typeof me; // typestr的值为"object" (如果左侧变量没有使用type 声明，则按照js的typeof规则来)

// 遍历属性in
// 将任何类型的键值转化成number类型
type TypeToNumber<T> = {
    [key in keyof T]: number
}

const obj: TypeToNumber<Person> = { name: 10, age: 10}

// 泛型 (可以在普通类型定义，类定义，函数定义上)

// 普通类型使用
type Dog<T> = {name: string, type: T};
const dog: Dog<number> = {name: "金毛", type: 3};

// 类定义
class Cat<T> {
    private type: T;
    constructor(type: T) { this.type = type; }
}

const cat: Cat<number> = new Cat<number>(20);

// 函数定义
function swipe<T, U>(value: [T, U]): [U, T] {
    return [value[1], value[0]];
}

swipe<Cat<number>, Dog<number>>([cat, dog]);

// 泛型推导和默认值
function adopt<T>(dog: Dog<T>) { return dog };
adopt(dog); // pass (不需要显式声明T的类型, type被推断为string)

// 泛型约束 (使用extends) 关键字
function sum<T extends number>(value: T[]): number {
    let count =0;
    value.forEach(v => count += v);
    return count
}

sum([1, 2]); // 数组的值必须是number类型

function pick<T, U extends keyof T> () {};

// 泛型推断 (infer, 不用预先指定在泛型列表中，在运行时会自动判断)
// 解析：{t: infer Test}可以看成是一个包含t属性的类型定义，这个t属性的value类型通过infer进行推断后会赋值给Test类型，
// 如果泛型实际参数符合{t: infer Test}的定义那么返回的就是Test类型，否则默认返回string类型
type Foo<T> = T extends {t: infer Test} ? Test : string

type One = Foo<number> // string, 因为number不是一个包含t的对象类型
type Two = Foo<{t: boolean}> // boolean, 因为泛型参数匹配上了，使用了infer对应的type
type Three = Foo<{a: number, t: () => void}> // () => void 泛型定义是参数的子集，同样适配

// 泛型工具
// partial<T> 将泛型中全部属性变为可选的

type Animal = {
    name: string,
    category: string,
    age: number,
    eat: () => number
}

type PartOfAnimal = Partial<Animal>;

// Record<K, T> 将K中所有属性值转化为T类型
// keyof any 对应的类型为number | string | symbol，也就是可以座位对象键的类型集合
// type Record<K extends keyof any, T> = {
//     [key in K] : T
// }

const newObj: Record<keyof Animal, string> = {
    name: "1",
    category: "2",
    age: "26",
    eat: "3",
}

// Pick<T, K> 将T类型中的K键列表提取出来，生成新的子键值对类型
// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P]
// }
const bird: Pick<Animal, "name" | "age"> = { name: 'bird', age: 1};

// Exclude<T, U> 在T类型中，去除T类型和U类型的交集，返回剩下的部分
// type Exclude<T, U> = T extends U ? never : T
// 注意这里的extends返回的T是原来的T中和U无交集的属性，而任何属性联合never都是自身。

type T1 = Exclude<"a" | "b" | "C", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function> // string | number

// Omit<T, K> 是适用于键值对对象的Exclude, 它会去除类型T中包含K的键值对
// type Omit = Pick<T, Exclude<keyof T, k>>
// Omit 与 Pick 得到的结果完全相反
const OmitAnimal: Omit<Animal, "name" | "age"> = { category: "Nan", eat: () => {return 26}}

// ReturnType<T>获取T类型(函数)对应的返回值类型
// type ReturnType<T extends func> = T extends () => infer R ? R :any;

function foo(x: string | number): string | number {
    return 1 
}

type FooType = ReturnType<typeof foo>;  // string | number

// Required<T> 将类型T中所有的属性变为必选项
// type Required<T> = {
// [P in keyof T]-?: T[P]
//}