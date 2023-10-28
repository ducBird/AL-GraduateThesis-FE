import { ICategory } from "../../../../interfaces/ICategory";

interface INavCategoryProps {
  categories: ICategory[];
}

export default function NavCategories({ categories }: INavCategoryProps) {
  return (
    <div>
      <ul>
        {categories &&
          categories.map((category: ICategory) => {
            return (
              <li
                key={category._id && category._id.toString()}
                className="relative flex flex-wrap w-full max-w-full uppercase"
              >
                <a
                  href="#"
                  className="relative flex flex-wrap flex-1 w-full px-[20px] py-[5px] items-center min-h-[50px] border border-b-black/10 text-[13px] font-semibold focus:ring-2 focus:text-primary_green focus:ring-primary_green transition-all duration-300"
                >
                  <span>{category.name}</span>
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
