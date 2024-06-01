import { HomePageLayout } from '~/components/layouts/home';
import {
	MahasiswaSelfProfile,
	MahasiswaSearchBar,
	MahasiswaList,
	SeeMahasiwaDetailOnVisit,
	MahasiswaListItem,
} from '../components';
import { useParams } from 'react-router-dom';
import { Dialog } from '~/components/ui';
import { useGetMahasiswaSelf } from '../api';
import { useAppSearchQueryContext } from '~/providers';
import { HomeHeaderLayout } from '~/components/layouts/home';

export function MainMahasiswaPage() {
	const { mahasiswaId } = useParams();
	const { data: mahasiswaSelf } = useGetMahasiswaSelf();

	const { activeKeyword, activeSort, setActiveKeyword, setActiveSort } =
		useAppSearchQueryContext();

	return (
		<HomePageLayout>
			<Dialog open>
				<SeeMahasiwaDetailOnVisit
					navigatePathOnClose="/mahasiswa"
					isOwnProfile={Number(mahasiswaId) === mahasiswaSelf?.id}
					mahasiswaId={Number(mahasiswaId)}
				/>
			</Dialog>

			<HomeHeaderLayout isAdmin={false} title="Kelass">
				<MahasiswaSelfProfile />
			</HomeHeaderLayout>

			<main className="flex flex-col gap-4 grow">
				<MahasiswaSearchBar
					keyword={activeKeyword}
					onKeywordChange={setActiveKeyword}
					sortType={activeSort}
					onSortTypeChange={setActiveSort}
				/>
				<MahasiswaList sort={activeSort} keyword={activeKeyword}>
					{(mahasiswa, virtualItem) => {
						if (mahasiswa === undefined) {
							return (
								<li
									key={virtualItem.key}
									className="absolute pt-1 inset-x-1"
									style={{
										height: `${virtualItem.size}px`,
										transform: `translateY(${virtualItem.start}px)`,
									}}
								>
									Gagal mengambil data mahasiswa
								</li>
							);
						}

						return (
							<li
								key={virtualItem.key}
								className="absolute pt-1 inset-x-1"
								style={{
									height: `${virtualItem.size}px`,
									transform: `translateY(${virtualItem.start}px)`,
								}}
							>
								<MahasiswaListItem
									isOwnProfile={Number(mahasiswa.id) === mahasiswaSelf?.id}
									mahasiswa={mahasiswa}
								/>
							</li>
						);
					}}
				</MahasiswaList>
			</main>
		</HomePageLayout>
	);
}
