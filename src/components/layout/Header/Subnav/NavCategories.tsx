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
            // biến dùng để kiểm tra xem một category có được chọn không
            const categoriesLink = `/product-category/${category._id}`;
            return (
              <li
                key={category._id && category._id.toString()}
                className="relative flex flex-wrap w-full max-w-full uppercase"
              >
                <a
                  href={categoriesLink}
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
