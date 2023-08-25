import { SkeletonAvatar, SkeletonButton, SkeletonContainer, SkeletonText } from "@calcom/ui";

function SkeletonLoader() {
  const rows = [1, 2, 3];
  return (
    <SkeletonContainer>
      <div className="mb-8 flex w-full items-center justify-center gap-4 px-1 sm:mb-12 sm:px-4 lg:w-2/3">
        <SkeletonText />
        <SkeletonButton />
      </div>
      <table className="w-full border-collapse text-[.5rem] sm:text-sm">
        <thead>
          <tr>
            <th>
              <SkeletonText />
            </th>
            <th>
              <SkeletonText />
            </th>
            <th>
              <SkeletonText />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td>
                <SkeletonAvatar />
              </td>
              <td>
                <SkeletonText />
              </td>
              <td>
                <SkeletonButton />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SkeletonContainer>
  );
}

export default SkeletonLoader;
