// Libraries
import React from 'react';

// Styles
import styles from './collectionCarousel.module.scss';

// Components
import CollectionTile from '../pageSpecificComponents/myCollectionsPageComponents/collectionComponents/collectionTile/CollectionTile';

function CollectionCarousel({ title, collections }) {
	return (
		<div className={styles.collection}>
			{title && <h2 className={styles.h2}>{title}</h2>}
			<div className={styles['scroll-wrapper']}>
				<div className={styles.carousel}>
					{collections && (
						<>
							{collections.map((collection, index) => {
								return (
									<CollectionTile
										key={index}
										collectionData={collection}
										collectionType={'visitor'}
										privacy={collection.privacy}
										size={'small'}
									/>
								);
							})}
							{collections.map((collection, index) => {
								return (
									<CollectionTile
										key={'2nd' + index}
										collectionData={collection}
										collectionType={'visitor'}
										privacy={collection.privacy}
										size={'small'}
									/>
								);
							})}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default CollectionCarousel;
