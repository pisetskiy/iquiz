package by.pisetskiy.iquiz.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Formula;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Quiz extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;
    @Column(nullable = false)
    private String title;
    private String description;
    private String bannerFile;
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = Boolean.TRUE;
    @Builder.Default
    private Boolean isPublic = Boolean.FALSE;
    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
    @Formula("(select count(qs.id) from question qs where qs.quiz_id = id and qs.is_active = 1)")
    private int questionCount;

    @Transient
    private Favorites favorites;
}
